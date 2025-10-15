
export enum Tab {
  Retouch = 'Retouch',
  Adjust = 'Adjust',
  Filters = 'Filters',
  Crop = 'Crop',
}

export type OriginalImage = {
  dataUrl: string;
  mimeType: string;
  name: string;
};

export type Hotspot = {
  x: number;
  y: number;
} | null;
