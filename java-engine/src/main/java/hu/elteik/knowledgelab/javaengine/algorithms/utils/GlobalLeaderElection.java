package hu.elteik.knowledgelab.javaengine.algorithms.utils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import hu.elteik.knowledgelab.javaengine.core.models.base.Robot;
import hu.elteik.knowledgelab.javaengine.core.models.base.RobotState;

public class GlobalLeaderElection<Object extends Robot> {
    
    public void run(List<Object> robotList) {
        List<Object> leaders = robotList.stream()
                .filter(robot -> robot.getState().equals(RobotState.LEADER))
                .collect(Collectors.toList());

        for (Object robot : leaders) {
            List<Object> nominees = robotList.stream()
                    .filter(nominee -> nominee.getState().equals(RobotState.LEADER) && Objects.equals(nominee.getOnID(), robot.getOnID()))
                    .collect(Collectors.toList());
            if (nominees.size() > 1) {
                Object leader = new LocalLeaderElection<Object>().run(nominees);
                nominees.remove(leader);
                for (Object nominee : nominees) {
                    nominee.setState(RobotState.EXPLORE);
                }
            }
        }
    }

}
