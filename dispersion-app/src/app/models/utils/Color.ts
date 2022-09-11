export enum Color {
  BLACK = 'BLACK',
  GREEN = 'GREEN',
  GREY = 'GREY',
  BROWN = 'BROWN',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  PINK = 'PINK',
  PURPLE = 'PURPLE',
  BLUE = 'BLUE',
  AQUA = 'AQUA'
}

export function getFontColor(color: Color | string): string {
  if (color === Color.AQUA || color === Color.YELLOW) {
    return '#000000';
  } else {
    return '#ffffff';
  }
}

export function getColorByHex(hex: string): Color {
  switch (hex) {
    case '#000000':
      return Color.BLACK;
    case '#003300':
      return Color.GREEN;
    case '#666666':
      return Color.GREY;
    case '#663300':
      return Color.BROWN;
    case '#ff9900':
      return Color.ORANGE;
    case '#ffff00':
      return Color.YELLOW;
    case '#ff33cc':
      return Color.PINK;
    case '#9900cc':
      return Color.PURPLE;
    case '#0000ff':
      return Color.BLUE;
    case '#00ffff':
      return Color.AQUA;
    default:
        throw new Error('Color not found!');
  }
}

export function getHexByColor(color: Color | string): string {
  switch (color) {
    case Color.BLACK:
      return '#000000';
    case Color.GREEN:
      return '#003300';
    case Color.GREY:
      return '#666666';
    case Color.BROWN:
      return '#663300';
    case Color.ORANGE:
      return '#ff9900';
    case Color.YELLOW:
      return '#ffff00';
    case Color.PINK:
      return '#ff33cc';
    case Color.PURPLE:
      return '#9900cc';
    case Color.BLUE:
      return '#0000ff';
    case Color.AQUA:
      return '#00ffff';
    default:
        throw new Error('Color not found!');
  }
}
