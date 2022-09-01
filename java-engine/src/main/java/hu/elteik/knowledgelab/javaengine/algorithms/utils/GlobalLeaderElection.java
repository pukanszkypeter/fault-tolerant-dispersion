package hu.elteik.knowledgelab.javaengine.algorithms.utils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import hu.elteik.knowledgelab.javaengine.core.models.base.Robot;
import hu.elteik.knowledgelab.javaengine.core.models.base.RobotState;

public class GlobalLeaderElection {
    
    public void run(List<Robot> robotList) {
        List<Robot> leaders = robotList.stream()
                .filter(robot -> robot.getState().equals(RobotState.LEADER))
                .collect(Collectors.toList());

        for (Robot robot : leaders) {
            List<Robot> nominees = robotList.stream()
                    .filter(nominee -> nominee.getState().equals(RobotState.LEADER) && Objects.equals(nominee.getOnID(), robot.getOnID()))
                    .collect(Collectors.toList());
            if (nominees.size() > 1) {
                Robot leader = new LocalLeaderElection().run(nominees);
                nominees.remove(leader);
                for (Robot nominee : nominees) {
                    nominee.setState(RobotState.EXPLORE);
                }
            }
        }
    }

}
