export default function JobPostingInput({value, onChange}) {
    const minLength = 50;
    const isTooShort = value.length > 0 && value.length < minLength;

    return (
        <div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste the full job posting here..."
                rows={8}
                className="w-full border border-gray-300 rouded-lg p-3 text-gray-800 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
            <div className="flex justify-between mt-1">
                {isTooShort ? (
                    <p className="text-sm text-red-500">At least {minLength} characters required.</p>
                ) : (
                    <p className="text-sm text-gray-400">{value.length} characters</p>
                )}
            </div>
        </div>
    );
}