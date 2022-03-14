import ActorsModel from "../Models/actors_model.js";
import MovieModel from "./../Models/movies_model.js";
import {
  okHttpResponse,
  createdHttpResponse,
  serverErrorHttpResponse,
} from "../Response/responseHelper.js";
import "dotenv/config";
import axios from "axios";
import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import firebase from "../FirebaseServices/firebase.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { v4 as uuidv4 } from "uuid";
export const createActors = async (req, res) => {
  const { name, age, gender } = req.body;
  let profile;
  const access_token = uuidv4();
  const saveFilenameInBucket = firebase.bucket.file(
    "profiles/" + `${Date.now()}${req.file.originalname}`
  );
  saveFilenameInBucket
    .getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    })
    .then((signedUrls) => {
      profile = signedUrls[0];
    });
  const saveFilenameInBucketWriter = saveFilenameInBucket.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });
  saveFilenameInBucketWriter.on("error", (error) => {
    console.log(error);
  });
  saveFilenameInBucketWriter.on("finish", async () => {
    const newActor = ActorsModel({
      name: name,
      age: age,
      gender: gender,
      profile: profile,
    });
    try {
      await newActor.save();
      createdHttpResponse(res, { message: "Actors created" });
    } catch (error) {
      serverErrorHttpResponse(res, error);
    }
  });
  saveFilenameInBucketWriter.end(req.file.buffer);
};
export const updateProfile = async (req, res) => {
  const id = req.params.id;
  try {
    await ActorsModel.updateOne(
      { _id: id },
      { profile: `${process.env.CLIENT_URL}/profile/${req.file.filename}` }
    );
    okHttpResponse(res, { message: "Profile updated successfully" });
  } catch (error) {
    serverErrorHttpResponse(res, error);
  }
};
export const getAllActors = async (req, res) => {
  const { limit, page } = req.query;
  let isLoggedin = false;
  if (0 >= page || !page) {
    page = 1;
  }
  if (0 >= limit || !limit) {
    limit = 10;
  }
  const Limit = parseInt(limit);
  const skip = (page - 1) * limit;
  try {
    const data = await ActorsModel.find();
    const allActors = await ActorsModel.find()
      .limit(Limit)
      .skip(skip)
      .lean()
      .sort({ name: 1 });
    const total_actors = data.length;

    const totalPage = Math.ceil(total_actors / limit);

    if (req.oidc.isAuthenticated()) {
      isLoggedin = true;
    }
    res.render("allActors", {
      actors: allActors,
      isLogin: isLoggedin,
      totalPage: totalPage,
      currentPage: page,
    });
    // okHttpResponse(res,allActors)
  } catch (error) {
    serverErrorHttpResponse(res, error);
  }
};
export const deleteActors = async (req, res) => {
  const id = req.params.id;
  try {
    await ActorsModel.findByIdAndRemove(id).exec();
    okHttpResponse(res, { message: "deleted successfully" });
  } catch (error) {
    serverErrorHttpResponse(res, error);
  }
};

export const getActorsById = async (req, res) => {
  const id = req.params.id;
  let isLoggedin = false;
  if (req.oidc.isAuthenticated()) {
    isLoggedin = true;
  }
  try {
    const data = await ActorsModel.findById(id).lean();
    console.log(data);
    res.render("actorsDetail", { actor: data, isLogin: isLoggedin });
  } catch (error) {
    serverErrorHttpResponse(res, error);
  }
};
export const updateActors = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    await ActorsModel.updateOne({ _id: id }, updatedData);
    okHttpResponse(res, { message: "updated successfully" });
  } catch (error) {
    serverErrorHttpResponse(res, error);
  }
};
export const calculateBusiness = async (req, res) => {
  let _id = req.params.id;
  try {
    const sum = await MovieModel.aggregate([
      { $match: {} },
      {
        $group: {
          _id: "$actors._id",
          Business_Done_By_Actor: { $sum: "$business_done" },
        },
      },
    ]);
    res.json(sum);
  } catch (error) {
    serverErrorHttpResponse(res, error);
  }
};
const downloadImage = (_url, filename) => {
  const _path = path.join(__dirname, `../Upload/actorsProfile/${filename}`);
  const localpath = fs.createWriteStream(_path);
  https.get(_url, (res) => {
    res.pipe(localpath);
  });
};
const allActorsFromApi = (allActors) => {
  const allActorsData = [];
  for (let i in allActors) {
    const image_name = path.basename(allActors[i].picture + Date.now());
    downloadImage(allActors[i].picture, image_name);
    if (
      allActors[i].title == "ms" ||
      allActors[i].title == "mrs" ||
      allActors[i].title == "miss"
    ) {
      allActorsData.push({
        name: allActors[i].firstName.concat(" ", allActors[i].lastName),
        gender: "female",
        profile: `${process.env.CLIENT_URL}/profile/${image_name}`,
        age: "",
      });
    }
    if (allActors[i].title == "mr") {
      allActorsData.push({
        name: allActors[i].firstName.concat(" ", allActors[i].lastName),
        gender: "male",
        profile: `${process.env.CLIENT_URL}/profile/${image_name}`,
        age: "",
      });
    } else {
      allActorsData.push({
        name: allActors[i].firstName.concat(" ", allActors[i].lastName),
        gender: "other",
        profile: `${process.env.CLIENT_URL}/profile/${image_name}`,
        age: "",
      });
    }
  }
  return allActorsData.slice(0, 50);
};
export const getDataFromApi = async (req, res) => {
  try {
    const res1 = await axios.get("https://dummyapi.io/data/v1/user", {
      headers: { "app-id": "622458559bc1995235af5b25" },
      params: { limit: 50, page: 0 },
    });
    const allActors = res1.data.data;
    const res2 = await axios.get("https://dummyapi.io/data/v1/user", {
      headers: { "app-id": "622458559bc1995235af5b25" },
      params: { limit: 50, page: 1 },
    });
    const allActors1 = res2.data.data;
    const actor_data = allActorsFromApi(allActors);
    const actor_data1 = allActorsFromApi(allActors1);
    actor_data.push(...actor_data1);
    try {
      ActorsModel.insertMany(actor_data, (error, docs) => {
        if (error) {
          serverErrorHttpResponse(res, error);
        } else {
          createdHttpResponse(res, {
            message: "All actors are added in database",
          });
        }
      });
    } catch (error) {
      serverErrorHttpResponse(res, error);
    }
  } catch (error) {
    serverErrorHttpResponse(res, error);
  }
};
