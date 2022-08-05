package hu.elteik.knowledgelab.javaengine.rest.dto;

import hu.elteik.knowledgelab.javaengine.core.models.Graph;
import hu.elteik.knowledgelab.javaengine.core.models.Robot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GraphStateDTO {

    private List<Robot> robotList;
    private Graph graph;
    private AlgorithmType algorithmType;
}
