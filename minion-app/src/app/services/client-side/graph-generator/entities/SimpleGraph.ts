export class SimpleGraph {

  size: number;
  matrix: boolean[];

  constructor(size: number) {
    this.size = size;
    this.matrix = [];
    for (let i = 0; i < size * (size - 1) / 2; ++i) {
      this.matrix[i] = false;
    }
  }

  calculateIndex(from: number, to: number) {
    if (from < to) {
      return to * (to - 1) / 2 + from;
    } else {
      return from * (from - 1) / 2 + to;
    }
  }

  hasEdge(from: number, to: number) {
    if (from == to) {
      return false;
    } else {
      return this.matrix[this.calculateIndex(from, to)];
    }
  }

  addEdge(from: number, to: number) {
    this.matrix[this.calculateIndex(from, to)] = true;
  }

  getNumberOfNodes() {
    return this.size;
  }

}
