'use client';

import { useState } from 'react';
import type { SetupSchema, SetupChoices } from './types';

type Props = {
  schema: SetupSchema;
  onSubmit: (choices: SetupChoices, forceRefresh: boolean) => void;
  loading?: boolean;
};

export default function SetupMenu({ schema, onSubmit, loading }: Props) {
  const [choices, setChoices] = useState<SetupChoices>(() => {
    const defaults: SetupChoices = {};
    for (const [key, field] of Object.entries(schema)) {
      if (field.type === 'checkbox') {
        defaults[key] = field.default;
      } else {
        defaults[key] = field.options[0];
      }
    }
    return defaults;
  });

  const [forceRefresh, setForceRefresh] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border-4 border-amber-700 bg-amber-50 p-6 shadow-xl">
      <h2 className="mb-4 text-center text-2xl font-bold text-amber-900">
        Game Setup
      </h2>

      <div className="space-y-4">
        {Object.entries(schema).map(([key, field]) => (
          <div key={key}>
            {field.type === 'checkbox' ? (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={choices[key] === true}
                  onChange={(e) =>
                    setChoices((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-amber-300 text-green-600"
                />
                <span className="text-sm font-semibold text-amber-800">{field.label}</span>
              </label>
            ) : (
              <>
                <label
                  htmlFor={key}
                  className="mb-1 block text-sm font-semibold text-amber-800"
                >
                  {field.label}
                </label>
                {field.helperText && (
                  <p className="mb-1 text-xs text-amber-600">{field.helperText}</p>
                )}
                <select
                  id={key}
                  value={String(choices[key])}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const val =
                      field.options.length > 0 && typeof field.options[0] === 'number'
                        ? Number(raw)
                        : raw;
                    setChoices((prev) => ({ ...prev, [key]: val }));
                  }}
                  className="w-full rounded-lg border-2 border-amber-300 bg-white px-3 py-2 text-amber-900 focus:border-amber-500 focus:outline-none"
                >
                  {field.options.map((opt) => (
                    <option key={String(opt)} value={String(opt)}>
                      {String(opt)}
                    </option>
                  ))}
                </select>
              </>
            )}
            {field.helperText && field.type === 'checkbox' && (
              <p className="mt-0.5 ml-7 text-xs text-amber-600">{field.helperText}</p>
            )}
          </div>
        ))}
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-amber-700">
        <input
          type="checkbox"
          checked={forceRefresh}
          onChange={(e) => setForceRefresh(e.target.checked)}
          className="rounded border-amber-300"
        />
        Generate new words (skip cache)
      </label>

      <button
        onClick={() => onSubmit(choices, forceRefresh)}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-green-600 px-4 py-3 text-lg font-bold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Loading words…' : 'Start Game'}
      </button>
    </div>
  );
}
