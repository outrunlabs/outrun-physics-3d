import { Mesh, Vector3 } from "outrun-renderer-3d";

import { PhysicsWorld } from "./../src/PhysicsWorld";

describe("PhysicsWorld", () => {
  it("raycasts against a mesh", () => {
    const world = new PhysicsWorld();

    // Create a 1x1 plane
    const smallPlaneMesh: Mesh = {
      vertexAttributes: [
        {
          name: "position",
          size: 3
        }
      ],
      vertexData: {
        position: new Float32Array([
          -1,
          0,
          -1,
          -1,
          0,
          1,
          1,
          0,
          -1,

          -1,
          0,
          -1,
          1,
          0,
          -1,
          1,
          0,
          1
        ])
      }
    };

    world.addMesh(smallPlaneMesh);

    const startPoint = Vector3.create(0, 2, 0);
    const endPoint = Vector3.create(0, -2, 0);

    const result = world.rayCast(startPoint, endPoint);

    // export(0).toBe(1)

    expect(result.hit).toEqual(true);

    expect(result.normal).toEqual(Vector3.create(0, 1, 0));
  });

  it("removes mesh when dispose is called", () => {
    const world = new PhysicsWorld();

    // Create a 1x1 plane
    const smallPlaneMesh: Mesh = {
      vertexAttributes: [
        {
          name: "position",
          size: 3
        }
      ],
      vertexData: {
        position: new Float32Array([
          -1,
          0,
          -1,
          -1,
          0,
          1,
          1,
          0,
          -1,

          -1,
          0,
          -1,
          1,
          0,
          -1,
          1,
          0,
          1
        ])
      }
    };

    const handle = world.addMesh(smallPlaneMesh);
    handle.dispose();

    const startPoint = Vector3.create(0, 2, 0);
    const endPoint = Vector3.create(0, -2, 0);

    const result = world.rayCast(startPoint, endPoint);

    expect(result.hit).toEqual(false);
  });
});
