import { Request, Response } from 'express';
import HeroSlide from '../models/HeroSlide';

export const listSlides = async (req: Request, res: Response): Promise<void> => {
  try {
    const slides = await HeroSlide.findAll({ order: [['order', 'ASC'], ['createdAt', 'ASC']] });
    res.status(200).json({ slides });
  } catch (error) {
    console.error('Error listing slides:', error);
    res.status(500).json({ message: 'Error listing slides', error });
  }
};

export const getSlideById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const slide = await HeroSlide.findByPk(id);
    if (!slide) {
      res.status(404).json({ message: 'Slide not found' });
      return;
    }
    res.status(200).json(slide);
  } catch (error) {
    console.error('Error fetching slide:', error);
    res.status(500).json({ message: 'Error fetching slide', error });
  }
};

export const createSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      subtitle,
      description,
      primaryButtonText,
      primaryButtonUrl,
      secondaryButtonText,
      secondaryButtonUrl,
      youtubeUrl,
      imageUrl,
      order,
      isActive,
    } = req.body;

    if (!title || typeof title !== 'string') {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const created = await HeroSlide.create({
      title,
      subtitle: subtitle ?? null,
      description: description ?? null,
      primaryButtonText: primaryButtonText ?? null,
      primaryButtonUrl: primaryButtonUrl ?? null,
      secondaryButtonText: secondaryButtonText ?? null,
      secondaryButtonUrl: secondaryButtonUrl ?? null,
      youtubeUrl: youtubeUrl ?? null,
      imageUrl: imageUrl ?? null,
      order: typeof order === 'number' ? order : 0,
      isActive: typeof isActive === 'boolean' ? isActive : true,
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating slide:', error);
    res.status(500).json({ message: 'Error creating slide', error });
  }
};

export const updateSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await HeroSlide.findByPk(id);
    if (!existing) {
      res.status(404).json({ message: 'Slide not found' });
      return;
    }

    const {
      title,
      subtitle,
      description,
      primaryButtonText,
      primaryButtonUrl,
      secondaryButtonText,
      secondaryButtonUrl,
      youtubeUrl,
      imageUrl,
      order,
      isActive,
    } = req.body;

    const updateData: any = {};
    if (typeof title === 'string') updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle ?? null;
    if (description !== undefined) updateData.description = description ?? null;
    if (primaryButtonText !== undefined) updateData.primaryButtonText = primaryButtonText ?? null;
    if (primaryButtonUrl !== undefined) updateData.primaryButtonUrl = primaryButtonUrl ?? null;
    if (secondaryButtonText !== undefined) updateData.secondaryButtonText = secondaryButtonText ?? null;
    if (secondaryButtonUrl !== undefined) updateData.secondaryButtonUrl = secondaryButtonUrl ?? null;
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl ?? null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl ?? null;
    if (typeof order === 'number') updateData.order = order;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    await HeroSlide.update(updateData, { where: { id } });
    const updated = await HeroSlide.findByPk(id);
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({ message: 'Error updating slide', error });
  }
};

export const deleteSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const slide = await HeroSlide.findByPk(id);
    if (!slide) {
      res.status(404).json({ message: 'Slide not found' });
      return;
    }
    await slide.destroy();
    res.status(200).json({ message: 'Slide deleted' });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({ message: 'Error deleting slide', error });
  }
};


