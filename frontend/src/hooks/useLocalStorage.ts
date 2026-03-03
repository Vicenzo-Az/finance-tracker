import { useCallback, useEffect, useState } from "react";

/**
 * Hook customizado para persistir estado no localStorage
 *
 * @template T - Tipo do valor a ser armazenado
 * @param {string} key - Chave única para identificar o item no localStorage
 * @param {T} initialValue - Valor inicial caso não exista no localStorage
 * @returns {[T, (value: T | ((val: T) => T)) => void]} Tupla com [valor, setValue]
 *
 * @example
 * ```tsx
 * const [user, setUser] = useLocalStorage('user', { name: 'John' });
 * setUser({ name: 'Jane' }); // Atualiza e persiste automaticamente
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // SSR-safe: Apenas acessa localStorage no navegador
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`[useLocalStorage] Erro ao ler "${key}":`, error);
      return initialValue;
    }
  });

  // Sincroniza com localStorage sempre que o valor mudar
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`[useLocalStorage] Erro ao salvar "${key}":`, error);
    }
  }, [storedValue, key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
      } catch (error) {
        console.error(`[useLocalStorage] Erro ao atualizar "${key}":`, error);
      }
    },
    [storedValue, key],
  );

  return [storedValue, setValue];
}

/**
 * Hook para sincronizar estado entre múltiplas abas/janelas do navegador
 *
 * Funciona como useLocalStorage, mas também escuta mudanças em outras abas
 * e atualiza o estado local automaticamente quando detecta alterações.
 *
 * @template T - Tipo do valor a ser armazenado
 * @param {string} key - Chave única para identificar o item no localStorage
 * @param {T} initialValue - Valor inicial caso não exista no localStorage
 * @returns {[T, (value: T | ((val: T) => T)) => void]} Tupla com [valor, setValue]
 *
 * @example
 * ```tsx
 * // Em múltiplas abas, todas verão a mesma mudança
 * const [count, setCount] = useLocalStorageSync('counter', 0);
 * ```
 */
export function useLocalStorageSync<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useLocalStorage<T>(key, initialValue);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            `[useLocalStorageSync] Erro ao sincronizar "${key}":`,
            error,
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, setStoredValue]);

  return [storedValue, setStoredValue];
}
