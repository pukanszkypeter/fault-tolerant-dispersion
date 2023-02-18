package hu.elte.ik.backend.module.algorithm.utils;

public class RandomNumber {

  public int get(int min, int max) {
    return (int) ((Math.random() * (max - min + 1)) + min);
  }
}
