package engine.algorithms.rotor_router_dispersion.models;

import engine.core.models.Node;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class RotorRouterDispersionNode extends Node {

    private Long rotorRouter;

}
