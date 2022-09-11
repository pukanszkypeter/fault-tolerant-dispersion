import { Edge } from "../../core/Edge";
import { Color } from "../../utils/Color";

export class RotorRouterDispersionEdge extends Edge {

    color: Color;

    constructor(id: number, fromID: number, toID: number, color: Color) {
        super(id, fromID, toID);
        this.color = color;
    }

}