import { faker } from "@faker-js/faker";
import { createServerFn } from "@tanstack/react-start";
import db from "@typemate/db";
import { PrefixedIDs } from "@typemate/db/ids";
import { type User, user } from "@typemate/db/schema";
import { Branded } from "@typemate/types";

export function createRandomUser() {
  return {
    id: Branded.UserId(PrefixedIDs.user()),
    createdAt: faker.date.past(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    image: faker.image.avatar(),
    emailVerified: true,
    updatedAt: null,
  } satisfies User;
}

const createUsers = createServerFn({ method: "GET" }).handler(() =>
  db
    .insert(user)
    .values(
      faker.helpers.multiple(createRandomUser, {
        count: 50,
      })
    )
    .returning()
);

export const fakerRepo = {
  createUsers,
};
