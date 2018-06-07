import { Mesh, Vector3 } from "outrun-renderer-3d";

import { PhysicsWorld } from "./../src/PhysicsWorld";

describe("PhysicsBody", () => {
  it("sets position correctly", () => {
    const world = new PhysicsWorld();

    const body = world.addBody(
      {
        type: "box",
        size: Vector3.create(1, 1, 1),
        mass: 5
      },
      Vector3.create(2, 2, 2)
    );

    expect(body.position).toEqual(Vector3.create(2, 2, 2));
  });

  it("updates position correctly", () => {
    const world = new PhysicsWorld();

    const body = world.addBody(
      {
        type: "box",
        size: Vector3.create(1, 1, 1),
        mass: 5
      },
      Vector3.create(2, 2, 2)
    );

    body.position = Vector3.create(3, 3, 3);

    expect(body.position).toEqual(Vector3.create(3, 3, 3));
  });

  it("is affected by gravity", () => {
    const world = new PhysicsWorld();

    const body = world.addBody(
      {
        type: "box",
        size: Vector3.create(1, 1, 1),
        mass: 5
      },
      Vector3.create(2, 2, 2)
    );

    world.stepSimulation(10, 10);
    world.stepSimulation(10, 10);
    world.stepSimulation(10, 10);

    expect(body.position.y).toBeLessThan(2);
  });
});
