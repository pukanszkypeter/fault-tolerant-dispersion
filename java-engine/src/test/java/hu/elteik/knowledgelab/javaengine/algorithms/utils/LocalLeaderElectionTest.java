package hu.elteik.knowledgelab.javaengine.algorithms.utils;

import hu.elteik.knowledgelab.javaengine.core.models.base.Color;
import hu.elteik.knowledgelab.javaengine.core.models.base.Robot;
import hu.elteik.knowledgelab.javaengine.core.models.base.RobotState;
import org.junit.jupiter.api.Test;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LocalLeaderElectionTest {

    @Test
    public void shouldThrowException() {
        List<Robot> candidates = List.of();
        assertThrows(RuntimeException.class, () -> new LocalLeaderElection<Robot>().run(candidates));
    }

    @Test
    public void shouldReturnLeaderWithOneCandidate() {
        List<Robot> candidates = List.of(new Robot(1L, RobotState.START, Color.BLACK, 1L, null));
        assertEquals(new LocalLeaderElection<Robot>().run(candidates), new Robot(1L, RobotState.START, Color.BLACK, 1L, null));
    }

    @Test
    public void shouldReturnLeaderWithMoreCandidate() {
        List<Robot> candidates = List.of(
                new Robot(1L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(2L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(3L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(4L, RobotState.START, Color.BLACK, 1L, null),
                new Robot(5L, RobotState.START, Color.BLACK, 1L, null)
        );
        Long leaderID = new LocalLeaderElection<Robot>().run(candidates).getID();
        assertTrue(1L <= leaderID && leaderID <= 5L);
    }

}
