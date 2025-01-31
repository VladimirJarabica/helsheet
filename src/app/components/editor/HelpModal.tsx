import {
  LightBulbIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import * as R from "ramda";
import { useState } from "react";
import Button from "../Button";
import { useSheetContext } from "./sheetContext";

interface KeyboardShortcutsProps {
  shortcuts: { shortcut: React.ReactNode; description: string }[];
}
const KeyboardShortcuts = ({ shortcuts }: KeyboardShortcutsProps) => {
  return (
    <>
      <hr className="my-1" />
      <h2 className="font-semibold">
        {shortcuts.length > 1 ? "Klávesové skratky" : "Klávesová skratka"}:
      </h2>
      <ol>
        {shortcuts.map((shortcut, index) => (
          <li key={index} className="flex">
            {shortcut.shortcut} : {shortcut.description}
          </li>
        ))}
      </ol>
    </>
  );
};

const STEPS = [
  "newBar",
  "openEditor",
  "direction",
  "bass",
  "notes",
  "combinations",
  "columnSplit",
  "columnMove",
  "tabMove",
  "noteLength",
  "publicize",
] as const;
type Step = (typeof STEPS)[number];

interface StepProps {
  step: Step;
  activeStepIndex: number;
  title: string;
  children: React.ReactNode;
  shortcuts?: React.ComponentProps<typeof KeyboardShortcuts>["shortcuts"];
  isCollapsed?: boolean;
}
const StepContent = ({
  step,
  activeStepIndex,
  title,
  children,
  shortcuts,
  isCollapsed,
}: StepProps) => {
  const activeStep = STEPS[activeStepIndex];
  return (
    step === activeStep && (
      <>
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">
            {title}{" "}
            <span className="text-sm text-gray-600">
              ({activeStepIndex + 1} / {STEPS.length})
            </span>
          </h2>
        </div>
        {!isCollapsed && (
          <>
            {children}
            {shortcuts && <KeyboardShortcuts shortcuts={shortcuts} />}
          </>
        )}
      </>
    )
  );
};

const HelpButton = () => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [step, setStep] = useState<Step>(STEPS[0]);
  const { tuning } = useSheetContext();

  const currentStepIndex = STEPS.indexOf(step);

  const close = () => {
    setIsHelpModalOpen(false);
    setIsCollapsed(false);
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={(e) => {
          e.stopPropagation();
          setIsHelpModalOpen(true);
        }}
        icon={<LightBulbIcon className="w-5" />}
      >
        Nápoveda
      </Button>
      {isHelpModalOpen && (
        <div
          className="z-20 right-0 bottom-0 fixed shadow-lg shadow-gray-400 border border-gray-400 rounded px-4 py-3 m-2 w-[600px] bg-hel-bgDefault max-w-[80%]"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="absolute top-3 right-2 flex gap-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setIsCollapsed((c) => !c)}
              icon={
                isCollapsed ? (
                  <ChevronUpIcon className="w-5" />
                ) : (
                  <ChevronDownIcon className="w-5" />
                )
              }
            >
              {isCollapsed ? "Rozbaliť" : "Zbaliť"}
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => close()}
              icon={<XMarkIcon className="w-5" />}
            >
              Zavrieť
            </Button>
          </div>
          <StepContent
            isCollapsed={isCollapsed}
            step="newBar"
            activeStepIndex={currentStepIndex}
            title="Pridanie taktu"
            shortcuts={[
              { shortcut: "Tlačidlo +", description: "pridá nový takt" },
            ]}
          >
            Pridaj nový takt kliknutím na tlačítko "Nový takt".
          </StepContent>
          <StepContent
            isCollapsed={isCollapsed}
            step="openEditor"
            activeStepIndex={currentStepIndex}
            title="Editor"
          >
            Otvor editor kliknutím na ľubovoľný stĺpec taktu.
          </StepContent>
          <StepContent
            isCollapsed={isCollapsed}
            step="direction"
            activeStepIndex={currentStepIndex}
            title="Smer mechu"
            shortcuts={[
              {
                shortcut: (
                  <>
                    Šípka <ChevronLeftIcon className="w-5" /> alebo{" "}
                    <ChevronRightIcon className="w-5" />
                  </>
                ),
                description: "zmení smeru ťahania mechu",
              },
            ]}
          >
            Vyber smer ťahania mechu:
            <ol className="ml-2">
              <li>a. šípkami {"< alebo >"}</li>
              <li>
                b. vybraním basu, ktorý je špecifický len pre jeden smer (F, dm,
                g...)
              </li>
              <li>c. vybraním noty v zozname gombíkov</li>
            </ol>
          </StepContent>
          <StepContent
            isCollapsed={isCollapsed}
            step="bass"
            activeStepIndex={currentStepIndex}
            title="Basy"
            shortcuts={R.uniqBy(
              (shortcut) => shortcut.shortcut,
              [
                ...tuning.bass.flatMap((row) =>
                  row.buttons.map((button) => ({
                    shortcut: button.push.shortcutKey ?? button.push.note,
                    description: `bas ${button.push.note}`,
                  }))
                ),
                ...tuning.bass.flatMap((row) =>
                  row.buttons.map((button) => ({
                    shortcut: button.pull.shortcutKey ?? button.pull.note,
                    description: `bas ${button.pull.note}`,
                  }))
                ),
              ]
            )}
          >
            Vyber basy kliknutím na tlačítko alebo použitím skratky
          </StepContent>
          <StepContent
            isCollapsed={isCollapsed}
            step="notes"
            activeStepIndex={currentStepIndex}
            title="Noty a čísla gombíkov"
            shortcuts={[
              {
                shortcut: "1 - 9",
                description: "Vyberie/zruší gombík 1 - 9 v prvok rade",
              },
              {
                shortcut: "x",
                description: "Vyberie/zruší 10. gombík v prvok rade",
              },
              {
                shortcut: "y",
                description: "Vyberie/zruší 11. gombík v prvok rade",
              },
              {
                shortcut: "ctrl + (1 - 9)",
                description: "Vyberie/zruší gombík 1 - 9 v druhom rade",
              },
              {
                shortcut: "ctrl + x",
                description: "Vyberie/zruší 10. gombík v druhom rade",
              },
            ]}
          >
            Výberom gombíkov sa vyberú noty a do aktívneho stĺpca sa zapíšu
            požadované čísla.
            <div className="font-semibold">Osnova</div>
            Požadovanú notu možno vybrať aj z notovej osnovy.
            <ol>
              <li>1. Vyber stupnicu prepisovaného notového záznamu</li>
              <li>
                2. Vyber transpozíciu do požadovanej stupnice a posun oktávy
                (voliteľné)
              </li>
              <li>3. Klikni na notu v notovej osnove</li>
            </ol>
          </StepContent>
          <StepContent
            isCollapsed={isCollapsed}
            step="combinations"
            activeStepIndex={currentStepIndex}
            title="Kombinácie"
          >
            Po výbere nôt sa zobrazia navrhované kombinácie.
            <br />
            Pokiaľ to kombinácia nôt umožňuje, môžeš vybrať vhodnú kombináciu
            gombíkov.
            <div className="font-semibold">Opačný smer</div>
            Zobrazia sa aj kombinácie s opačným smerom ťahania mechu.
            <br />
            POZOR: Kombinácia s opačným smerom vymaže basy, ktoré v novom smere
            nie sú možné (F, dm). Basy nachádzajúce sa v oboch smeroch ostanú
            nezmenené (C, B).
          </StepContent>
          <StepContent
            isCollapsed={isCollapsed}
            step="columnSplit"
            activeStepIndex={currentStepIndex}
            title="Rozdelenie stĺpca"
            shortcuts={[
              {
                shortcut: "m",
                description: "rozdelí/zlúči melodickú časť (rady)",
              },
              { shortcut: "n", description: "rozdelí/zlúči basovä časť" },
            ]}
          >
            Stĺpec je možné rozdeliť na dve časti, separátne v melodickej a
            basovej časti.
            <br />
            Vznikne tak možnosť zapísať kratšiu notu, než dovoľuje celý stĺpec.
            <br />
            POZOR: Zlúčenie stĺpca zachová gombíky, basy a smer len z prvej
            časti stĺpca. Druhá časť stĺpca bude vymazaná.
          </StepContent>
          <StepContent
            isCollapsed={isCollapsed}
            step="columnMove"
            activeStepIndex={currentStepIndex}
            title="Pohyb medzi stĺpcami"
            shortcuts={[
              { shortcut: "tab", description: "posun na ďalší stĺpec" },
              {
                shortcut: "shift + tab",
                description: "posun na predošlý stĺpec",
              },
            ]}
          >
            Posúvať sa medzi stĺpcami možno buď kliknutím na požadovaný stĺpec,
            alebo klávesovými skratkami.
          </StepContent>
          <StepContent
            isCollapsed={isCollapsed}
            step="tabMove"
            activeStepIndex={currentStepIndex}
            title="Pohyb medzi záložkami"
            shortcuts={[
              {
                shortcut: "medzerník",
                description: "posun medzi záložkami noty/dĺžka nôt/prstoklad",
              },
            ]}
          >
            Posúvať sa medzi záložkami (noty/dĺžka nôt/prstoklad) možno buď
            kliknutím na záložku, alebo klávesovou skratkou.
          </StepContent>
          <StepContent
            isCollapsed={isCollapsed}
            step="noteLength"
            activeStepIndex={currentStepIndex}
            title="Dĺžka nôt"
            shortcuts={[
              {
                shortcut: (
                  <>
                    Šípka <ChevronUpIcon className="w-5" /> alebo{" "}
                    <ChevronDownIcon className="w-5" />
                  </>
                ),
                description: "Presun aktívnej noty/base",
              },
              {
                shortcut: (
                  <>
                    Šípka <ChevronLeftIcon className="w-5" /> alebo{" "}
                    <ChevronRightIcon className="w-5" />
                  </>
                ),
                description: "Výber dĺžky trvania noty/basu",
              },
            ]}
          >
            <ol>
              <li>1. Vyber záložku "Dĺžka nôt"</li>
              <li>2. Vyber aktívny gombík alebo bas</li>
              <li>3. Nastav požadovanú dĺžku trvania</li>
            </ol>
          </StepContent>
          <StepContent
            isCollapsed={isCollapsed}
            step="publicize"
            activeStepIndex={currentStepIndex}
            title="Zverejnenie"
          >
            Zápis je možné zverejniť prepnutím na "Verejné" v pravom hornom
            rohu.
            <br />
            Po zverejnení je zápis dostupný pre všetkých používateľov.
          </StepContent>
          {!isCollapsed && (
            <div className="flex gap-2 mt-2">
              {currentStepIndex > 0 && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setStep(STEPS[currentStepIndex - 1])}
                >
                  Späť
                </Button>
              )}
              {currentStepIndex < STEPS.length - 1 ? (
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setStep(STEPS[currentStepIndex + 1])}
                >
                  Ďalej
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setStep(STEPS[0])}
                  >
                    Na začiatok
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => close()}
                  >
                    Zavrieť nápovedu
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HelpButton;
