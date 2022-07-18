package hu.elteik.knowledgelab.javaengine.algorithms.utils;

public class RandomNumber {

    public int get(int min, int max) {
        return (int) ((Math.random() * (max - min)) + min);
    }

}
