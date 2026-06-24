import React, { useState } from 'react';
import { CurrencyInput } from './CurrencyInput';
import { CurrencyInputFloating } from './CurrencyInputFloating';
import { CurrencyInputFilled } from './CurrencyInputFilled';
import { CurrencyInputCompact } from './CurrencyInputCompact';
import { CurrencyOption, DEFAULT_CURRENCIES } from './types';

const SUGGESTIONS = [
  '1,000',
  '5,000',
  '10,000',
  '25,000',
  '50,000',
  '1,00,000',
  '5,00,000',
  '10,00,000',
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="label-medium text-text-dark mb-4 border-b border-border-border-light pb-2 font-semibold">
    {children}
  </h2>
);

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="paragraph-extra-small text-text-light mb-2">{children}</p>
);

export const CurrencyInputDemo = () => {
  // Variant 1 — Standard
  const [v1Default, setV1Default] = useState('');
  const [v1Error, setV1Error] = useState('1234');
  const [v1Currency, setV1Currency] = useState<CurrencyOption>(DEFAULT_CURRENCIES[0]);

  // Variant 2 — Floating
  const [v2Default, setV2Default] = useState('');
  const [v2Filled, setV2Filled] = useState('50,000');
  const [v2Currency, setV2Currency] = useState<CurrencyOption>(DEFAULT_CURRENCIES[1]);

  // Variant 3 — Filled
  const [v3Default, setV3Default] = useState('');
  const [v3Error, setV3Error] = useState('');
  const [v3Currency, setV3Currency] = useState<CurrencyOption>(DEFAULT_CURRENCIES[2]);

  // Variant 4 — Compact
  const [v4a, setV4a] = useState('');
  const [v4b, setV4b] = useState('10,000');
  const [v4Currency, setV4Currency] = useState<CurrencyOption>(DEFAULT_CURRENCIES[3]);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  return (
    <div className="bg-fill-fill min-h-screen p-10">
      <div className="mx-auto max-w-2xl space-y-12">

        {/* Header */}
        <div>
          <h1 className="label-large text-text-dark mb-1 text-2xl font-bold">CurrencyInput</h1>
          <p className="paragraph-medium text-text-light">
            4 variants — all support currency switching, symbol display, and inline autocomplete
            (type a prefix from the suggestions list then press <kbd className="bg-fill-fill-dark rounded px-1 py-0.5 text-xs font-mono">Tab</kbd> or{' '}
            <kbd className="bg-fill-fill-dark rounded px-1 py-0.5 text-xs font-mono">→</kbd> to accept).
          </p>
          <div className="paragraph-extra-small text-text-light mt-2">
            Suggestions: {SUGGESTIONS.join(' · ')}
          </div>
        </div>

        {/* ── Variant 1: Standard ── */}
        <section>
          <SectionTitle>Variant 1 — Standard (bordered, external label)</SectionTitle>
          <div className="space-y-6">
            <div>
              <SubLabel>Default — empty</SubLabel>
              <CurrencyInput
                name="v1-default"
                label="Transfer Amount"
                isMandatory
                value={v1Default}
                onChange={handleChange(setV1Default)}
                onCurrencyChange={setV1Currency}
                suggestions={SUGGESTIONS}
                placeholder="0.00"
                helperText={`Selected: ${v1Currency.code} ${v1Currency.symbol}`}
              />
            </div>
            <div>
              <SubLabel>With value</SubLabel>
              <CurrencyInput
                name="v1-filled"
                label="Transfer Amount"
                value="25,000"
                onChange={() => {}}
                placeholder="0.00"
                helperText="Minimum transfer ₹500"
              />
            </div>
            <div>
              <SubLabel>Error state</SubLabel>
              <CurrencyInput
                name="v1-error"
                label="Transfer Amount"
                value={v1Error}
                onChange={handleChange(setV1Error)}
                suggestions={SUGGESTIONS}
                error
                placeholder="0.00"
                showErrorHelperText="Amount must be at least ₹1,000"
              />
            </div>
            <div>
              <SubLabel>Disabled</SubLabel>
              <CurrencyInput
                name="v1-disabled"
                label="Transfer Amount"
                value="10,000"
                onChange={() => {}}
                placeholder="0.00"
                disabled
                helperText="This field is locked"
              />
            </div>
          </div>
        </section>

        {/* ── Variant 2: Floating Label ── */}
        <section>
          <SectionTitle>Variant 2 — Floating Label (outlined, label animates inside)</SectionTitle>
          <div className="space-y-6">
            <div>
              <SubLabel>Empty — click to see label float</SubLabel>
              <CurrencyInputFloating
                name="v2-default"
                label="Transfer Amount"
                isMandatory
                value={v2Default}
                onChange={handleChange(setV2Default)}
                onCurrencyChange={setV2Currency}
                defaultCurrency={DEFAULT_CURRENCIES[1]}
                suggestions={SUGGESTIONS}
                helperText={`Currency: ${v2Currency.code}`}
              />
            </div>
            <div>
              <SubLabel>Pre-filled value</SubLabel>
              <CurrencyInputFloating
                name="v2-filled"
                label="Beneficiary Amount"
                value={v2Filled}
                onChange={handleChange(setV2Filled)}
                defaultCurrency={DEFAULT_CURRENCIES[1]}
                suggestions={SUGGESTIONS}
                helperText="Approx. USD 599.00 at current rate"
              />
            </div>
            <div>
              <SubLabel>Error state</SubLabel>
              <CurrencyInputFloating
                name="v2-error"
                label="Transfer Amount"
                value="500"
                onChange={() => {}}
                defaultCurrency={DEFAULT_CURRENCIES[1]}
                error
                showErrorHelperText="Exceeds daily transfer limit of USD 500"
              />
            </div>
            <div>
              <SubLabel>Disabled with value</SubLabel>
              <CurrencyInputFloating
                name="v2-disabled"
                label="Transfer Amount"
                value="1,250.00"
                onChange={() => {}}
                defaultCurrency={DEFAULT_CURRENCIES[1]}
                disabled
              />
            </div>
          </div>
        </section>

        {/* ── Variant 3: Filled ── */}
        <section>
          <SectionTitle>Variant 3 — Filled (fill background, underline only)</SectionTitle>
          <div className="space-y-6">
            <div>
              <SubLabel>Default — empty</SubLabel>
              <CurrencyInputFilled
                name="v3-default"
                label="Amount"
                isMandatory
                value={v3Default}
                onChange={handleChange(setV3Default)}
                onCurrencyChange={setV3Currency}
                defaultCurrency={DEFAULT_CURRENCIES[2]}
                suggestions={SUGGESTIONS}
                helperText={`Currency: ${v3Currency.code}`}
              />
            </div>
            <div>
              <SubLabel>Pre-filled value</SubLabel>
              <CurrencyInputFilled
                name="v3-filled"
                label="Amount"
                value="1,00,000"
                onChange={() => {}}
                defaultCurrency={DEFAULT_CURRENCIES[2]}
                helperText="Max limit: €10,000 per transaction"
              />
            </div>
            <div>
              <SubLabel>Error state</SubLabel>
              <CurrencyInputFilled
                name="v3-error"
                label="Amount"
                value={v3Error}
                onChange={handleChange(setV3Error)}
                defaultCurrency={DEFAULT_CURRENCIES[2]}
                suggestions={SUGGESTIONS}
                error
                showErrorHelperText="Amount cannot exceed €5,000"
              />
            </div>
            <div>
              <SubLabel>Disabled</SubLabel>
              <CurrencyInputFilled
                name="v3-disabled"
                label="Amount"
                value="2,500.00"
                onChange={() => {}}
                defaultCurrency={DEFAULT_CURRENCIES[2]}
                disabled
              />
            </div>
          </div>
        </section>

        {/* ── Variant 4: Compact ── */}
        <section>
          <SectionTitle>Variant 4 — Compact (pill, no label, inline use)</SectionTitle>
          <div className="space-y-6">
            <div>
              <SubLabel>Default — empty (try typing 1, 5, 10...)</SubLabel>
              <CurrencyInputCompact
                name="v4-default"
                value={v4a}
                onChange={handleChange(setV4a)}
                defaultCurrency={DEFAULT_CURRENCIES[3]}
                suggestions={SUGGESTIONS}
              />
            </div>
            <div>
              <SubLabel>With value + clear button</SubLabel>
              <CurrencyInputCompact
                name="v4-filled"
                value={v4b}
                onChange={handleChange(setV4b)}
                onCurrencyChange={setV4Currency}
                defaultCurrency={DEFAULT_CURRENCIES[3]}
                suggestions={SUGGESTIONS}
              />
            </div>
            <div>
              <SubLabel>Error state</SubLabel>
              <CurrencyInputCompact
                name="v4-error"
                value="999"
                onChange={() => {}}
                defaultCurrency={DEFAULT_CURRENCIES[3]}
                error
              />
            </div>
            <div>
              <SubLabel>Disabled</SubLabel>
              <CurrencyInputCompact
                name="v4-disabled"
                value="5,000.00"
                onChange={() => {}}
                defaultCurrency={DEFAULT_CURRENCIES[3]}
                disabled
              />
            </div>
            <div>
              <SubLabel>Compact in context — inline with other elements</SubLabel>
              <div className="flex items-center gap-3">
                <span className="paragraph-medium text-text-text">Pay</span>
                <CurrencyInputCompact
                  name="v4-inline"
                  value={v4a}
                  onChange={handleChange(setV4a)}
                  defaultCurrency={DEFAULT_CURRENCIES[0]}
                  suggestions={SUGGESTIONS}
                />
                <span className="paragraph-medium text-text-text">to recipient</span>
              </div>
            </div>
          </div>
        </section>

        {/* Autocomplete hint */}
        <section className="bg-fill-fill-dark rounded-xl p-5">
          <h3 className="label-medium text-text-dark mb-2 font-semibold">Inline Autocomplete</h3>
          <p className="paragraph-medium text-text-text">
            All variants share the same ghost-text autocomplete engine. Type the start of any
            suggestion (e.g. <strong>5</strong> → <em>5,000</em>). The completion appears as
            dimmed text after the cursor. Press{' '}
            <kbd className="bg-fill-fill rounded px-1 py-0.5 text-xs font-mono border border-border-border">Tab</kbd> or{' '}
            <kbd className="bg-fill-fill rounded px-1 py-0.5 text-xs font-mono border border-border-border">→</kbd> when
            the cursor is at the end to accept. The ghost is invisible outside focus to avoid clutter.
          </p>
        </section>

      </div>
    </div>
  );
};
