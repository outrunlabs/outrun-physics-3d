import { Mesh, Vector3 } from "outrun-renderer-3d";

const AmmoFunction = require("./deps/ammo");

export interface RayHitResult {
  hit: boolean;
  normal: Vector3;
  point: Vector3;
}

export class PhysicsWorld {
  private _ammo: any;
  private _ammoPhysicsWorld: any;

  constructor() {
    AmmoFunction().then(ammo => {
      this._ammo = ammo;
      this._initWorld();
      console.log("init complete");
    });
  }
  public addMesh(mesh: Mesh): void {
    console.log("addMesh");
    const positions = mesh.vertexData["position"];

    const physicsMesh = new this._ammo.btTriangleMesh();

    console.dir(this._ammo.btVector3);
    for (let i = 0; i < positions.length; i += 9) {
      console.log(i);
      const v1 = new this._ammo.btVector3(
        positions[i + 0],
        positions[i + 1],
        positions[i + 2]
      );
      const v2 = new this._ammo.btVector3(
        positions[i + 3],
        positions[i + 4],
        positions[i + 5]
      );
      const v3 = new this._ammo.btVector3(
        positions[i + 6],
        positions[i + 7],
        positions[i + 7]
      );

      physicsMesh.addTriangle(v1, v2, v3, true);
    }

    const shape = new this._ammo.btBvhTriangleMeshShape(
      physicsMesh,
      true,
      true
    );

    const transform = new this._ammo.btTransform();
    transform.setIdentity();

    const groundMass = 0;
    const groundLocalInertia = new this._ammo.btVector3(0, 0, 0);
    const groundMotionState = new this._ammo.btDefaultMotionState(transform);

    const bci = new this._ammo.btRigidBodyConstructionInfo(
      groundMass,
      groundMotionState,
      shape
    );
    const body = new this._ammo.btRigidBody(bci);

    this._ammoPhysicsWorld.addRigidBody(body);
  }

  public rayCast(
    startPosition: Vector3,
    destinationPosition: Vector3
  ): RayHitResult {
    const v1 = this._vectorToAmmoVector(startPosition);
    const v2 = this._vectorToAmmoVector(destinationPosition);
    const callback = new this._ammo.ClosestRayResultCallback(v1, v2);

    this._ammoPhysicsWorld.rayTest(v1, v2, callback);

    const hit = callback.hasHit();
    const ap = callback.get_m_hitPointWorld();
    const an = callback.get_m_hitNormalWorld();

    return {
      hit,
      normal: Vector3.create(an.x(), an.y(), an.z()),
      point: Vector3.create(ap.x(), ap.y(), ap.z())
    };
  }

  private _initWorld(): void {
    const collisionConfiguration = new this._ammo.btDefaultCollisionConfiguration();
    const dispatcher = new this._ammo.btCollisionDispatcher(
      collisionConfiguration
    );
    const broadphase = new this._ammo.btDbvtBroadphase();
    const solver = new this._ammo.btSequentialImpulseConstraintSolver();

    this._ammoPhysicsWorld = new this._ammo.btDiscreteDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      collisionConfiguration
    );
    this._ammoPhysicsWorld.setGravity(this._createAmmoVector(0, -6, 0));
  }

  private _vectorToAmmoVector(vec: Vector3): any {
    return this._createAmmoVector(vec.x, vec.y, vec.z);
  }

  private _createAmmoVector(x: number, y: number, z: number): any {
    return new this._ammo.btVector3(x, y, z);
  }
}
