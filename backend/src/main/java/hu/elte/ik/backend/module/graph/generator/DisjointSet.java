package hu.elte.ik.backend.module.graph.generator;

import java.util.ArrayList;
import java.util.List;

public class DisjointSet {

  int size;
  int numberOfComponents;
  List<DisjointSetNode> items;

  public DisjointSet(int size) {
    this.size = size;
    this.numberOfComponents = size;
    this.items = new ArrayList<>();
    for (int i = 0; i < size; ++i) {
      this.items.add(new DisjointSetNode(i, null, 0, 1));
    }
  }

  public DisjointSetNode findComponent(int value) {
    DisjointSetNode node = this.items.get(value);
    while (node.parent != null) {
      node = node.parent;
    }

    return node;
  }

  public void unionComponents(int left, int right) {
    DisjointSetNode p = this.findComponent(left);
    DisjointSetNode q = this.findComponent(right);

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
