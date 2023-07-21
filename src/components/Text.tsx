
export function Field({ type = "text", state, setState, callback, text }: { type: string, state: string, setState: (state: string) => void, callback: (state: string) => void, text: string }) {
    return (
        <div>
            <input
                type={type}
                value={state}
                onChange={(e) => {
                    setState(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    if (state === "") return;
                    callback(state);
                    setState("");
                }}
            >
                {text}
            </button>
        </div>
    )
}
