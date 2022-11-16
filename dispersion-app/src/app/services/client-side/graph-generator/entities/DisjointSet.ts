export class Node {
  value: number;
  parent: Node;
  height: number;
  size: number;

  constructor(value: number, parent: Node, height: number, size: number) {
    this.value = value;
    this.parent = parent;
    this.height = height;
    this.size = size;
  }
}

export class DisjointSet {
  size: number;
  numberOfComponents: number;
  items: Node[];

  constructor(size: number) {
    this.size = size;
    this.numberOfComponents = size;
    this.items = [];
    for (let i = 0; i < size; ++i) {
      this.items[i] = new Node(i, null, 0, 1);
    }
  }

  findComponent(value: number) {
    let component = this.items[value];
    while (component.parent != null) {
      component = component.parent;
    }

    return component;
  }

  unionComponents(left: number, right: number) {
    let p = this.findComponent(left);
    let q = this.findComponent(right);

    if (p.value == q.value) {
      return;
    }

    this.numberOfComponents--;
    if (p.height < q.height) {
      p.parent = q;
      p.size += q.size;
    } else if (p.height > q.height) {
      q.parent = p;
      q.size += p.size;
    } else {
      if (p.size > q.size) {
        p.parent = q;
        q.size += p.size;
        q.height++;
      } else {
        q.parent = p;
        p.size += q.size;
        p.height++;
      }
    }
  }
}
