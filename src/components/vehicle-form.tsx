"use client";
import { useActionState, useState } from "react";
import Image from "next/image";
import type { Vehicle } from "@prisma/client";
import { saveVehicleAction } from "@/app/actions";
import {
  categories,
  cities,
  features,
  purposes,
  parsePhotos,
  MAX_PHOTOS,
} from "@/lib/marketplace";
import { Icon } from "./icon";
import { SelectMenu } from "./select-menu";
import { ActionForm } from "./action-form";

const toOptions = (values: readonly string[]) =>
  values.map((value) => ({ value, label: value }));

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const [state, action, pending] = useActionState(saveVehicleAction, {});
  const existingPhotos = vehicle ? parsePhotos(vehicle.photos, vehicle.image) : [];
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [category, setCategory] = useState(vehicle?.category || "Hatchback");
  const [city, setCity] = useState(vehicle?.city || "Colombo");
  const [transmission, setTransmission] = useState(
    vehicle?.transmission || "Automatic",
  );
  const [fuel, setFuel] = useState(vehicle?.fuel || "Petrol");
  const [driveType, setDriveType] = useState(vehicle?.driveType || "Self-drive");
  const selectedFeatures: string[] = vehicle
    ? JSON.parse(vehicle.features)
    : [];
  const selectedPurposes: string[] = vehicle
    ? JSON.parse(vehicle.purposes || "[]")
    : [];
  return (
    <ActionForm action={action} className="vehicle-form form-stack">
      {vehicle && <input type="hidden" name="id" value={vehicle.id} />}
      <div className="form-section">
        <div className="form-section-heading">
          <span>01</span>
          <div>
            <h2>Introduce your vehicle</h2>
            <p>The details that help renters find their perfect match.</p>
          </div>
        </div>
        <label>
          Listing title
          <input
            name="title"
            placeholder="e.g. Toyota Aqua — your easy city companion"
            defaultValue={vehicle?.title}
            required
            minLength={5}
            maxLength={80}
          />
        </label>
        <div className="form-grid three">
          <label>
            Brand
            <input
              name="brand"
              placeholder="Toyota"
              defaultValue={vehicle?.brand}
              required
              maxLength={40}
            />
          </label>
          <label>
            Model
            <input
              name="model"
              placeholder="Aqua"
              defaultValue={vehicle?.model}
              required
              maxLength={40}
            />
          </label>
          <label>
            Year
            <input
              name="year"
              type="number"
              min={1970}
              max={new Date().getFullYear() + 1}
              defaultValue={vehicle?.year || 2022}
              required
            />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Vehicle type
            <SelectMenu
              name="category"
              label="Vehicle type"
              value={category}
              onChange={setCategory}
              options={toOptions(categories.slice(1))}
            />
          </label>
          <label>
            Pickup city
            <SelectMenu
              name="city"
              label="Pickup city"
              value={city}
              onChange={setCity}
              options={toOptions(cities)}
            />
          </label>
        </div>
      </div>
      <div className="form-section">
        <div className="form-section-heading">
          <span>02</span>
          <div>
            <h2>Set the details</h2>
            <p>Your vehicle, your rate, your rental terms.</p>
          </div>
        </div>
        <div className="form-grid three">
          <label>
            Transmission
            <SelectMenu
              name="transmission"
              label="Transmission"
              value={transmission}
              onChange={setTransmission}
              options={toOptions(["Automatic", "Manual"])}
            />
          </label>
          <label>
            Fuel
            <SelectMenu
              name="fuel"
              label="Fuel"
              value={fuel}
              onChange={setFuel}
              options={toOptions(["Petrol", "Diesel", "Hybrid", "Electric"])}
            />
          </label>
          <label>
            Seats
            <input
              name="seats"
              type="number"
              min={2}
              max={20}
              defaultValue={vehicle?.seats || 5}
              required
            />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Daily rate (LKR)
            <input
              name="dailyRate"
              type="number"
              min={1000}
              max={500000}
              step={1}
              defaultValue={vehicle?.dailyRate}
              placeholder="6500"
              required
            />
          </label>
          <label>
            Rental type
            <SelectMenu
              name="driveType"
              label="Rental type"
              value={driveType}
              onChange={setDriveType}
              options={toOptions(["Self-drive", "With driver"])}
            />
          </label>
        </div>
        <fieldset className="features-fieldset">
          <legend>What’s it good for?</legend>
          <div className="checkbox-grid">
            {purposes.slice(1).map((purpose) => (
              <label key={purpose}>
                <input
                  type="checkbox"
                  name="purposes"
                  value={purpose}
                  defaultChecked={selectedPurposes.includes(purpose)}
                />
                {purpose}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="features-fieldset">
          <legend>What’s included?</legend>
          <div className="checkbox-grid">
            {features.map((feature) => (
              <label key={feature}>
                <input
                  type="checkbox"
                  name="features"
                  value={feature}
                  defaultChecked={selectedFeatures.includes(feature)}
                />
                {feature}
              </label>
            ))}
          </div>
        </fieldset>
        <label>
          About your vehicle
          <textarea
            name="description"
            rows={5}
            minLength={30}
            maxLength={3000}
            required
            defaultValue={vehicle?.description}
            placeholder="What makes your vehicle a great choice? Mention mileage limits, deposit, insurance, pickup arrangements, and anything renters should know."
          />
        </label>
      </div>
      <div className="form-section">
        <div className="form-section-heading">
          <span>03</span>
          <div>
            <h2>Show it off</h2>
            <p>
              Add up to {MAX_PHOTOS} clear, recent photos of your actual
              vehicle. The first photo is used as the cover.
            </p>
          </div>
        </div>
        {existingPhotos.length > 0 && (
          <div className="photo-manager">
            <p className="photo-manager-label">
              Current photos — tick any you’d like to remove.
            </p>
            <div className="photo-manager-grid">
              {existingPhotos.map((url, index) => {
                const isRemoved = removed.includes(url);
                return (
                  <label
                    key={url}
                    className={`photo-thumb${isRemoved ? " removed" : ""}`}
                  >
                    <Image src={url} alt="" fill unoptimized sizes="200px" />
                    {index === 0 && !isRemoved && (
                      <span className="photo-badge">Cover</span>
                    )}
                    <span className="photo-thumb-check">
                      <input
                        type="checkbox"
                        name="removePhoto"
                        value={url}
                        checked={isRemoved}
                        onChange={(event) =>
                          setRemoved((current) =>
                            event.target.checked
                              ? [...current, url]
                              : current.filter((item) => item !== url),
                          )
                        }
                      />
                      Remove
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        <label className="upload-area">
          {newPreviews.length > 0 ? (
            <div className="upload-preview-grid">
              {newPreviews.map((src, index) => (
                <div key={index} className="upload-preview">
                  <Image
                    src={src}
                    alt="Your vehicle photo preview"
                    fill
                    unoptimized
                    sizes="300px"
                  />
                </div>
              ))}
            </div>
          ) : (
            <Icon name="upload" size={32} />
          )}
          <strong>
            {vehicle ? "Add more photos" : "Add your vehicle photos"}
          </strong>
          <span>JPEG, PNG or WebP · up to 5 MB each</span>
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required={!vehicle}
            onChange={(event) => {
              newPreviews.forEach((url) => URL.revokeObjectURL(url));
              const files = Array.from(event.target.files ?? []);
              setNewPreviews(files.map((file) => URL.createObjectURL(file)));
            }}
          />
        </label>
      </div>
      {state.error && (
        <p className="form-message error" role="alert">
          {state.error}
        </p>
      )}
      <div className="form-submit-row">
        <p>
          Your contact number will appear on your listing.
          <br />
          You can edit or pause your listing at any time.
        </p>
        <button className="button button-green" disabled={pending}>
          {pending
            ? "Saving your vehicle…"
            : vehicle
              ? "Save changes"
              : "Publish your vehicle"}
          <Icon name="northeast" size={18} />
        </button>
      </div>
    </ActionForm>
  );
}
