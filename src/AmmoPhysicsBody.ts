import { Vector3, Quaternion } from "outrun-renderer-3d";

import { IPhysicsBody, PhysicsBodyInfo } from "./PhysicsBody";

export class AmmoPhysicsBody {
  private _position: Vector3;
  private _rotation: Quaternion;

  public get position(): Vector3 {
    this._updateStateFromBody();
    return this._position;
  }

  public get rotation(): Quaternion {
    this._updateStateFromBody();
    return this._rotation;
  }

  public set position(val: Vector3) {
    let trans = new this._Ammo.btTransform();

    const ms = this._ammoBody.getMotionState();

    if (ms) {
      ms.getWorldTransform(trans);
      trans.setOrigin(new this._Ammo.btVector3(val.x, val.y, val.z));
      ms.setWorldTransform(trans);
    }
  }

  constructor(private _Ammo: any, private _ammoBody: any) {}

  public applyCentralImpulse(impulse: Vector3) {
    const vec = new this._Ammo.btVector3(impulse.x, impulse.y, impulse.z);
    this._ammoBody.applyCentralImpulse(vec);
  }

  public dispose(): void {
    // TODO
  }

  private _updateStateFromBody(): void {
    let trans = new this._Ammo.btTransform();

    const ms = this._ammoBody.getMotionState();
    if (ms) {
      ms.getWorldTransform(trans);
      const origin = trans.getOrigin();
      this._position = Vector3.create(origin.x(), origin.y(), origin.z());

      const rot = trans.getRotation();
      this._rotation = Quaternion.create(rot.x(), rot.y(), rot.z(), rot.w());
    }
  }
}

export const createAmmoPhysicsBody = (Ammo: any, ammoPhysicsWorld: any) => (
  pbi: PhysicsBodyInfo,
  initialPosition: Vector3 = Vector3.zero()
): IPhysicsBody => {
  let ammoShape = null;
  switch (pbi.type) {
    case "box":
      let margin = typeof pbi.margin === "number" ? pbi.margin : 0.05;
      ammoShape = new Ammo.btBoxShape(
        new Ammo.btVector3(pbi.size.x, pbi.size.y, pbi.size.z)
      );
      ammoShape.setMargin(margin);
      break;
    default:
      throw new Error("Unrecognized shape type: " + pbi.type);
  }

  const localInertia = new Ammo.btVector3(0, 0, 0);
  ammoShape.calculateLocalInertia(pbi.mass, localInertia);

  const transform = new Ammo.btTransform();
  transform.setIdentity();

  transform.setOrigin(
    new Ammo.btVector3(initialPosition.x, initialPosition.y, initialPosition.z)
  );

  const motionState = new Ammo.btDefaultMotionState(transform);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    pbi.mass,
    motionState,
    ammoShape,
    localInertia
  );
  const body = new Ammo.btRigidBody(rbInfo);

  ammoPhysicsWorld.addRigidBody(body);

  return new AmmoPhysicsBody(Ammo, body);
};
