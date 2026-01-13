import { Request, Response } from 'express';
import Contact from '../models/Contact';

// Create a new contact form submission
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'სახელი, ელ-ფოსტა, თემა და შეტყობინება აუცილებელია'
      });
    }

    // Create new contact
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject,
      message: message.trim(),
      status: 'new'
    });

    return res.status(201).json({
      success: true,
      message: 'შეტყობინება წარმატებით გაიგზავნა! ჩვენ მალე დაგიკავშირდებით.',
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });

  } catch (error: any) {
    console.error('Contact creation error:', error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: 'მონაცემების ვალიდაციის შეცდომა',
        errors: validationErrors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'შეტყობინების გაგზავნისას მოხდა შეცდომა. გთხოვთ სცადოთ ხელახლა.'
    });
  }
};

// Get all contacts (Admin only)
export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: offset,
    });

    const formattedContacts = contacts.map(contact => {
      const contactData = contact.get({ plain: true });
      return {
        ...contactData,
        contactId: `CNT-${contactData.id?.toString().padStart(6, '0') || '000000'}`
      };
    });

    return res.json({
      success: true,
      contacts: formattedContacts,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    return res.status(500).json({
      success: false,
      message: 'კონტაქტების ჩამოტვირთვისას მოხდა შეცდომა'
    });
  }
};

// Get contact by ID (Admin only)
export const getContactById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(String(id));
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'კონტაქტი ვერ მოიძებნა'
      });
    }

    const contactData = contact.get({ plain: true });
    const formattedContact = {
      ...contactData,
      contactId: `CNT-${contactData.id?.toString().padStart(6, '0') || '000000'}`
    };

    return res.json({
      success: true,
      contact: formattedContact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    return res.status(500).json({
      success: false,
      message: 'კონტაქტის ჩამოტვირთვისას მოხდა შეცდომა'
    });
  }
};

// Update contact status (Admin only)
export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'responded', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'არასწორი სტატუსი'
      });
    }

    const contact = await Contact.findByPk(String(id));
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'კონტაქტი ვერ მოიძებნა'
      });
    }

    contact.status = status;
    await contact.save();
    await contact.reload();

    const contactData = contact.get({ plain: true });
    const formattedContact = {
      ...contactData,
      contactId: `CNT-${contactData.id?.toString().padStart(6, '0') || '000000'}`
    };

    return res.json({
      success: true,
      message: 'კონტაქტის სტატუსი წარმატებით განახლდა',
      contact: formattedContact
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    return res.status(500).json({
      success: false,
      message: 'კონტაქტის სტატუსის განახლებისას მოხდა შეცდომა'
    });
  }
};

// Delete contact (Admin only)
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(String(id));
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'კონტაქტი ვერ მოიძებნა'
      });
    }

    await contact.destroy();

    return res.json({
      success: true,
      message: 'კონტაქტი წარმატებით წაიშალა'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    return res.status(500).json({
      success: false,
      message: 'კონტაქტის წაშლისას მოხდა შეცდომა'
    });
  }
};

// Get contact statistics (Admin only)
export const getContactStats = async (req: Request, res: Response) => {
  try {
    const totalContacts = await Contact.count();
    const newContacts = await Contact.count({ where: { status: 'new' } });
    const readContacts = await Contact.count({ where: { status: 'read' } });
    const respondedContacts = await Contact.count({ where: { status: 'responded' } });
    const closedContacts = await Contact.count({ where: { status: 'closed' } });

    // Get contacts by subject
    const salesContacts = await Contact.count({ where: { subject: 'sales' } });
    const supportContacts = await Contact.count({ where: { subject: 'support' } });
    const installationContacts = await Contact.count({ where: { subject: 'installation' } });
    const warrantyContacts = await Contact.count({ where: { subject: 'warranty' } });
    const otherContacts = await Contact.count({ where: { subject: 'other' } });

    return res.json({
      success: true,
      stats: {
        total: totalContacts,
        byStatus: {
          new: newContacts,
          read: readContacts,
          responded: respondedContacts,
          closed: closedContacts
        },
        bySubject: {
          sales: salesContacts,
          support: supportContacts,
          installation: installationContacts,
          warranty: warrantyContacts,
          other: otherContacts
        }
      }
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'სტატისტიკის ჩამოტვირთვისას მოხდა შეცდომა'
    });
  }
};
