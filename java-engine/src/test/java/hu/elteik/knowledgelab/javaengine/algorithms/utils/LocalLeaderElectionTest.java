package hu.elteik.knowledgelab.javaengine.algorithms.utils;

import hu.elteik.knowledgelab.javaengine.core.models.Color;
import hu.elteik.knowledgelab.javaengine.core.models.Robot;
import hu.elteik.knowledgelab.javaengine.core.models.RobotState;
import org.junit.jupiter.api.Test;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LocalLeaderElectionTest {

    @Test
    public void shouldThrowException() {
        List<Robot> candidates = List.of();
        assertThrows(RuntimeException.class, () -> new LocalLeaderElection().run(candidates));
    }

    @Test
    public void shouldReturnLeaderWithOneCandidate() {
        List<Robot> candidates = List.of(new Robot(1L, RobotState.START, Color.BLACK, 1L));
        assertEquals(new LocalLeaderElection().run(candidates), new Robot(1L, RobotState.START, Color.BLACK, 1L));
    }

    @Test
    public void shouldReturnLeaderWithMoreCandidate() {
        List<Robot> candidates = List.of(
                new Robot(1L, RobotState.START, Color.BLACK, 1L),
                new Robot(2L, RobotState.START, Color.BLACK, 1L),
                new Robot(3L, RobotState.START, Color.BLACK, 1L),
                new Robot(4L, RobotState.START, Color.BLACK, 1L),
                new Robot(5L, RobotState.START, Color.BLACK, 1L)
        );
        Long leaderID = new LocalLeaderElection().run(candidates).getID();
        assertTrue(1L <= leaderID && leaderID <= 5L);
    }

}