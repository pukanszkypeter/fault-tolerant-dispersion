export interface Color {
  hex: string
}

export const colors: Color[] = [
  {hex: '#ff0000'},
  {hex: '#ff9900'},
  {hex: '#ff0066'},
  {hex: '#990099'},
  {hex: '#0000ff'},
  {hex: '#00ffff'},
  {hex: '#003300'},
  {hex: '#00cc00'},
  {hex: '#663300'},
  {hex: '#ffff00'}
];

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
