import { createContext, useContext, useEffect, useRef } from "react";
import { useSheetContext } from "./sheetContext";

type KeyOptions = {
  metaKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
};

type KeyboardListenerContext = {
  registerListener: (
    id: string,
    key: string,
    listener: (options: KeyOptions) => void,
    preventDefault?: boolean
  ) => void;
  unregisterListener: (id: string, key: string) => void;
};

const keyboardListenerContext = createContext<KeyboardListenerContext>({
  registerListener: () => {},
  unregisterListener: () => {},
});

interface KeyboardListenerProviderProps {
  children: React.ReactNode;
}

export const KeyboardListenerContextProvider = ({
  children,
}: KeyboardListenerProviderProps) => {
  const { isEditing } = useSheetContext();

  const listenersRef = useRef<
    Record<
      string,
      {
        id: string;
        key: string;
        listener: (options: KeyOptions) => void;
        preventDefault: boolean;
      }[]
    >
  >({});

  useEffect(() => {
    if (isEditing) {
      const listener = (e: KeyboardEvent) => {
        const key = e.key;
        console.log("key down", key, e.metaKey, e.shiftKey, e.ctrlKey);

        const keyListeners = listenersRef.current[key] ?? [];

        keyListeners.forEach((listener) => {
          listener.listener({
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
          });
          if (listener.preventDefault) {
            e.preventDefault();
          }
        });
      };

      window.addEventListener("keydown", listener);

      return () => {
        listenersRef.current = {};
        window.removeEventListener("keydown", listener);
      };
    }
    return undefined;
  }, [isEditing]);

  const registerListener = (
    id: string,
    key: string,
    listener: (options: KeyOptions) => void,
    preventDefault?: boolean
  ) => {
    // Register listener
    listenersRef.current[key] = listenersRef.current[key] ?? [];
    listenersRef.current[key].push({
      id,
      key,
      listener,
      preventDefault: !!preventDefault,
    });
  };

  const unregisterListener = (id: string, key: string) => {
    // Unregister listener
    listenersRef.current[key] = listenersRef.current[key]?.filter(
      (listener) => listener.id !== id
    );
  };

  return (
    <keyboardListenerContext.Provider
      value={{ registerListener, unregisterListener }}
    >
      {children}
    </keyboardListenerContext.Provider>
  );
};

export const useKeyboardListener = ({
  id,
  key,
  listener,
  preventDefault,
}: {
  id: string;
  key: string;
  listener: (options: KeyOptions) => void;
  preventDefault?: boolean;
}) => {
  const { registerListener, unregisterListener } = useContext(
    keyboardListenerContext
  );

  useEffect(() => {
    registerListener(id, key, listener, preventDefault);
    return () => unregisterListener(id, key);
  }, [id, key, listener, preventDefault, registerListener, unregisterListener]);
};

export const useKeyboardListeners = <Key extends string>({
  id,
  keys,
  listener,
}: {
  id: string;
  keys: Key[];
  listener: (key: Key, options: KeyOptions) => void;
}) => {
  const { registerListener, unregisterListener } = useContext(
    keyboardListenerContext
  );

  useEffect(() => {
    keys.forEach((key) => {
      registerListener(id + key, key, (options) => listener(key, options));
    });
    return () => keys.forEach((key) => unregisterListener(id + key, key));
  }, [id, keys.join("_"), listener, registerListener, unregisterListener]);
};
