import { Vector3, Quaternion } from "outrun-renderer-3d";

export type PhysicsBodyInfo = {
  type: "box";
  size: Vector3;
  margin?: number;
  mass: number;
};

export interface IPhysicsBody {
  position: Vector3;
  rotation: Quaternion;

  applyCentralImpulse(impulse: Vector3);

  dispose(): void;
}
