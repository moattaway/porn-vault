import Actor from "../../types/actor";
import Label from "../../types/label";
import Scene from "../../types/scene";
import Movie from "../../types/movie";
import { Dictionary, mapAsync } from "../../types/utility";
import ProcessingQueue from "../../queue/index";
import Studio from "../../types/studio";
import * as database from "../../database/index";
import CustomField from "../../types/custom_field";
import { getImages } from "./search/image";
import { getScenes } from "./search/scene";
import { getActors } from "./search/actor";
import { getStudios } from "./search/studio";
import { getMovies } from "./search/movie";

export default {
  async getScenesWithoutLabels(_, { num }: { num: number }) {
    return (
      await mapAsync(await Scene.getAll(), async scene => ({
        scene,
        numLabels: (await Scene.getLabels(scene)).length
      }))
    )
      .filter(i => i.numLabels == 0)
      .map(i => i.scene)
      .slice(0, num || 12);
  },

  async getActorsWithoutLabels(_, { num }: { num: number }) {
    return (
      await mapAsync(await Actor.getAll(), async actor => ({
        actor,
        numLabels: (await Actor.getLabels(actor)).length
      }))
    )
      .filter(i => i.numLabels == 0)
      .map(i => i.actor)
      .slice(0, num || 12);
  },

  async getScenesWithoutActors(_, { num }: { num: number }) {
    return (
      await mapAsync(await Scene.getAll(), async scene => ({
        scene,
        numActors: (await Scene.getActors(scene)).length
      }))
    )
      .filter(i => i.numActors == 0)
      .map(i => i.scene)
      .slice(0, num || 12);
  },

  async getActorsWithoutScenes(_, { num }: { num: number }) {
    return (
      await mapAsync(await Actor.getAll(), async actor => ({
        actor,
        numScenes: (await Scene.getByActor(actor._id)).length
      }))
    )
      .filter(i => i.numScenes == 0)
      .map(i => i.actor)
      .slice(0, num || 12);
  },

  async topActors(_, { num }: { num: number }) {
    return (await Actor.getTopActors()).slice(0, num || 12);
  },

  async getQueueInfo() {
    return {
      length: await ProcessingQueue.getLength()
    };
  },

  getStudios,

  getMovies,

  getActors,
  getScenes,
  getImages,

  async getSceneById(_, args: Dictionary<any>) {
    return await Scene.getById(args.id);
  },

  async getActorById(_, args: Dictionary<any>) {
    return await Actor.getById(args.id);
  },

  async getMovieById(_, args: Dictionary<any>) {
    return await Movie.getById(args.id);
  },

  async getStudioById(_, args: Dictionary<any>) {
    return await Studio.getById(args.id);
  },

  async getLabelById(_, args: Dictionary<any>) {
    return await Label.getById(args.id);
  },
  async getCustomFields() {
    const fields = await CustomField.getAll();
    return fields.sort((a, b) => a.name.localeCompare(b.name));
  },
  async getLabels() {
    const labels = await Label.getAll();
    return labels.sort((a, b) => a.name.localeCompare(b.name));
  },
  async numScenes() {
    return await database.count(database.store.scenes, {});
  },
  async numActors() {
    return await database.count(database.store.actors, {});
  },
  async numMovies() {
    return await database.count(database.store.movies, {});
  },
  async numLabels() {
    return await database.count(database.store.labels, {});
  },
  async numStudios() {
    return await database.count(database.store.studios, {});
  },
  async numImages() {
    return await database.count(database.store.images, {});
  }
};
