import { Request, Response } from 'express';
import Setting from '../models/Setting';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Setting.findByPk(1);
    if (!settings) {
      settings = await Setting.create({ id: 1, promoEnabled: false, promoText: '' });
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { promoEnabled, promoText, promoYoutubeUrl } = req.body as { promoEnabled?: boolean; promoText?: string; promoYoutubeUrl?: string };
    let settings = await Setting.findByPk(1);
    if (!settings) {
      settings = await Setting.create({ id: 1, promoEnabled: false, promoText: '' });
    }

    if (promoEnabled !== undefined) settings.promoEnabled = Boolean(promoEnabled);
    if (promoText !== undefined) settings.promoText = String(promoText);
    if (promoYoutubeUrl !== undefined) {
      const url = String(promoYoutubeUrl).trim();
      settings.promoYoutubeUrl = url || null;
      settings.promoYoutubeTitle = null;
      settings.promoYoutubeThumbnail = null;
      if (url) {
        try {
          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
          const resp = await fetch(oembedUrl);
          if (resp.ok) {
            const data = await resp.json() as { title?: string; thumbnail_url?: string };
            settings.promoYoutubeTitle = data.title || null;
            settings.promoYoutubeThumbnail = data.thumbnail_url || null;
          }
        } catch (e) {
          // ignore metadata fetch errors
        }
      }
    }
    await settings.save();

    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};

