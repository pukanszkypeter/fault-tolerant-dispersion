package hu.elte.ik.backend.module.graph.generator;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class DisjointSetNode {

  int value;
  DisjointSetNode parent;
  int height;
  int size;
}
