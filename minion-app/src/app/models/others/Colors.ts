export interface Color {
  hex: string,
  text: string,
  fontColor: string
}

export const colors: Color[] = [
  {hex: '#000000', text: 'black', fontColor: '#ffffff'},
  {hex: '#003300', text: 'dark_green', fontColor: '#ffffff'},
  {hex: '#666666', text: 'grey', fontColor: '#ffffff'},
  {hex: '#663300', text: 'brown', fontColor: '#ffffff'},
  {hex: '#ff9900', text: 'orange', fontColor: '#ffffff'},
  {hex: '#ffff00', text: 'yellow', fontColor: '#000000'},
  {hex: '#ff33cc', text: 'pink', fontColor: '#ffffff'},
  {hex: '#9900cc', text: 'purple', fontColor: '#ffffff'},
  {hex: '#0000ff', text: 'dark_blue', fontColor: '#ffffff'},
  {hex: '#00ffff', text: 'aqua', fontColor: '#000000'}
];

export function getColorByHex(hex: string): Color {
  return colors.find(color => color.hex === hex);
}

export function getRandomColors(quantity: number): Color[] {
  if (quantity <= 10) {
    const tempColors = [...colors];
    let resultColors: Color[] = [];

    for (let i = 0; i < quantity; i++) {
      let random = tempColors[Math.floor(Math.random()*tempColors.length)];
      resultColors.push(random);
      const index = tempColors.indexOf(random);
      if (index > -1) {
        tempColors.splice(index, 1);
      }
    }

    return resultColors;
  } else {
    return [];
  }
}
