// contexts/chat-context.tsx
import {createContext} from 'react';

interface ContextType {
    names: string[];
    fetchNames: (collection_name: string) => Promise<void>;
    generate: (collection_name: string, name: string) => Promise<void>;
    images: string[];
    name: string;
    setName: (name: string) => void;
}

const Context = createContext<ContextType>({
        names: [],
        fetchNames: () => Promise.resolve(),
        generate: () => Promise.resolve(),
        images: [],
        name: "",
        setName: () => {}
    }
);

export default Context;
