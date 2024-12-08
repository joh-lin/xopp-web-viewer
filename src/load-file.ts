export async function load_file(inFile: File): Promise<Document> {
    const ds = new DecompressionStream("gzip");
    const parser = new DOMParser();

    const decompressedStream = inFile.stream().pipeThrough(ds);
    return parser.parseFromString(
        await new Response(decompressedStream).text(), "text/xml");
}