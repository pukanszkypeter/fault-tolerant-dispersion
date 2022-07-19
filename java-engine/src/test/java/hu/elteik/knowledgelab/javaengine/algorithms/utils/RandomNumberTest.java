package hu.elteik.knowledgelab.javaengine.algorithms.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RandomNumberTest {

    @Test
    public void shouldReturnNull() {
        assertEquals(0, new RandomNumber().get(0, 0));
    }

    @Test
    public void shouldReturnBetweenOneAndFive() {
        int random = new RandomNumber().get(1, 5);
        assertTrue( 1 <= random && random <= 5);
    }

}