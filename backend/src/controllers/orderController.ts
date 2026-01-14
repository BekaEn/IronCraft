import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerInfo, cartItems, total, paymentMethod } = req.body;

    // Validate required fields
    if (!customerInfo || !cartItems || !total || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'ყველა აუცილებელი ველი უნდა იყოს შევსებული'
      });
    }

    // Validate customer info
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'documentNumber', 'address'];
    for (const field of requiredFields) {
      if (!customerInfo[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} აუცილებელია`
        });
      }
    }

    // Create order
    const order = await Order.create({
      customerInfo,
      items: cartItems,
      totalAmount: total,
      paymentMethod,
      status: 'pending',
      paymentStatus: paymentMethod === 'online' ? 'pending' : 'completed'
    });

    // Generate order ID
    const orderId = `ORD-${order.id.toString().padStart(6, '0')}`;

    return res.status(201).json({
      success: true,
      message: 'შეკვეთა წარმატებით შეიქმნა',
      orderId,
      order: {
        id: order.id,
        orderId,
        customerInfo: order.customerInfo,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return res.status(500).json({
      success: false,
      message: 'შეკვეთის შექმნისას მოხდა შეცდომა',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false
        }
      ]
    });

    // Add formatted order IDs
    const formattedOrders = orders.map(order => {
      const orderData = order.get({ plain: true });
      return {
        ...orderData,
        orderId: `ORD-${orderData.id?.toString().padStart(6, '0') || '000000'}`
      };
    });

    return res.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'შეკვეთების ჩამოტვირთვისას მოხდა შეცდომა'
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(String(id), {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'შეკვეთა ვერ მოიძებნა'
      });
    }

    const orderData = order.get({ plain: true });
    const formattedOrder = {
      ...orderData,
      orderId: `ORD-${orderData.id?.toString().padStart(6, '0') || '000000'}`
    };

    return res.json({
      success: true,
      order: formattedOrder
    });

  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({
      success: false,
      message: 'შეკვეთის ჩამოტვირთვისას მოხდა შეცდომა'
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findByPk(String(id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'შეკვეთა ვერ მოიძებნა'
      });
    }

    // Update order
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    
    // Reload the order to get the updated data
    await order.reload();

    const orderData = order.get({ plain: true });
    const formattedOrder = {
      ...orderData,
      orderId: `ORD-${orderData.id?.toString().padStart(6, '0') || '000000'}`
    };

    return res.json({
      success: true,
      message: 'შეკვეთა წარმატებით განახლდა',
      order: formattedOrder
    });

  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({
      success: false,
      message: 'შეკვეთის განახლებისას მოხდა შეცდომა'
    });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(String(id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'შეკვეთა ვერ მოიძებნა'
      });
    }

    await order.destroy();

    return res.json({
      success: true,
      message: 'შეკვეთა წარმატებით წაიშალა'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    return res.status(500).json({
      success: false,
      message: 'შეკვეთის წაშლისას მოხდა შეცდომა'
    });
  }
};

// Get order statistics for admin dashboard
export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const completedOrders = await Order.count({ where: { status: 'delivered' } });
    
    // Calculate total revenue from completed orders
    const completedOrdersData = await Order.findAll({
      where: { paymentStatus: 'completed' },
      attributes: ['totalAmount']
    });
    
    const totalRevenue = completedOrdersData.reduce((sum, order) => sum + parseFloat(order.totalAmount.toString()), 0);

    return res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'სტატისტიკის ჩამოტვირთვისას მოხდა შეცდომა'
    });
  }
};
