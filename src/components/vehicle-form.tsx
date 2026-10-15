"use client";
import { useActionState, useState } from "react";
import Image from "next/image";
import type { Vehicle } from "@prisma/client";
import { saveVehicleAction } from "@/app/actions";
import { categories, cities, features } from "@/lib/marketplace";
import { Icon } from "./icon";
import { ActionForm } from "./action-form";

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const [state, action, pending] = useActionState(saveVehicleAction, {});
  const [preview, setPreview] = useState(vehicle?.image || "");
  const selectedFeatures: string[] = vehicle
    ? JSON.parse(vehicle.features)
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
            <select
              name="category"
              defaultValue={vehicle?.category || "Hatchback"}
            >
              {categories.slice(1).map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Pickup city
            <select name="city" defaultValue={vehicle?.city || "Colombo"}>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
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
            <select
              name="transmission"
              defaultValue={vehicle?.transmission || "Automatic"}
            >
              <option>Automatic</option>
              <option>Manual</option>
            </select>
          </label>
          <label>
            Fuel
            <select name="fuel" defaultValue={vehicle?.fuel || "Petrol"}>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Hybrid</option>
              <option>Electric</option>
            </select>
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
            <select
              name="driveType"
              defaultValue={vehicle?.driveType || "Self-drive"}
            >
              <option>Self-drive</option>
              <option>With driver</option>
            </select>
          </label>
        </div>
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
              A clear, recent photo of your actual vehicle makes all the
              difference.
            </p>
          </div>
        </div>
        <label className="upload-area">
          {preview ? (
            <div className="upload-preview">
              <Image
                src={preview}
                alt="Your vehicle photo preview"
                fill
                unoptimized
                sizes="600px"
              />
            </div>
          ) : (
            <Icon name="upload" size={32} />
          )}
          <strong>
            {preview ? "Choose a different photo" : "Add your vehicle photo"}
          </strong>
          <span>JPEG, PNG or WebP · up to 5 MB</span>
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            required={!vehicle}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
                setPreview(URL.createObjectURL(file));
              }
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
