import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileType2, Folder, Search, ChevronRight, ArrowLeft } from "lucide-react";
import { MaterialFile, MaterialFolder, MaterialNode, studyMaterialsTree } from "@/data/studyMaterials";

interface SearchResult {
  item: MaterialNode;
  pathNames: string[];
}

const getFolderFromPath = (root: MaterialFolder, path: string[]): MaterialFolder => {
  let current = root;

  for (const folderId of path) {
    const nextFolder = current.children.find(
      (node): node is MaterialFolder => node.kind === "folder" && node.id === folderId,
    );

    if (!nextFolder) {
      return root;
    }

    current = nextFolder;
  }

  return current;
};

const collectSearchResults = (folder: MaterialFolder, query: string, pathNames: string[] = []): SearchResult[] => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const results: SearchResult[] = [];
  const currentPath = [...pathNames, folder.name];

  for (const node of folder.children) {
    if (node.kind === "folder") {
      const folderMatches = node.name.toLowerCase().includes(normalizedQuery);
      if (folderMatches) {
        results.push({ item: node, pathNames: currentPath });
      }
      results.push(...collectSearchResults(node, normalizedQuery, currentPath));
      continue;
    }

    const fileMatches = [node.name, node.subject, node.unit].some((field) =>
      field.toLowerCase().includes(normalizedQuery),
    );
    if (fileMatches) {
      results.push({ item: node, pathNames: currentPath });
    }
  }

  return results;
};

const FileTypeIcon = ({ type }: { type: MaterialFile["fileType"] }) => {
  if (type === "word") return <FileType2 className="h-5 w-5" />;
  return <FileText className="h-5 w-5" />;
};

const Apuntes = () => {
  const [folderPath, setFolderPath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const currentFolder = useMemo(
    () => getFolderFromPath(studyMaterialsTree, folderPath),
    [folderPath],
  );

  const breadcrumbs = useMemo(() => {
    const crumbs: { id: string; name: string }[] = [{ id: "root", name: studyMaterialsTree.name }];
    let current = studyMaterialsTree;
    for (const folderId of folderPath) {
      const next = current.children.find(
        (child): child is MaterialFolder => child.kind === "folder" && child.id === folderId,
      );
      if (!next) break;
      crumbs.push({ id: next.id, name: next.name });
      current = next;
    }
    return crumbs;
  }, [folderPath]);

  const searchResults = useMemo(
    () => collectSearchResults(studyMaterialsTree, searchQuery),
    [searchQuery],
  );

  const isSearching = searchQuery.trim().length > 0;
  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container py-10 md:py-14 max-w-6xl">
      <div className="text-sm uppercase tracking-widest text-primary font-semibold mb-3">Material de Estudio</div>
      <h1 className="font-display text-3xl md:text-5xl font-bold mb-3 text-foreground">
        Repositorio academico DND
      </h1>
      <p className="text-muted-foreground text-base md:text-lg mb-6">
        Navega por carpetas como en Drive, busca por materia o unidad y abre cada archivo en su enlace externo.
      </p>

      <div className="paper rounded-xl p-4 md:p-5 mb-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar materia, unidad o archivo..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div className="inline-flex items-center" key={crumb.id}>
                <button
                  type="button"
                  onClick={() => setFolderPath(folderPath.slice(0, index))}
                  className="rounded px-2 py-1 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                >
                  {crumb.name}
                </button>
                {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>

          {!isSearching && folderPath.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => setFolderPath((prev) => prev.slice(0, -1))}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver una carpeta
            </Button>
          )}
        </div>
      </div>

      {isSearching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {searchResults.length === 0 ? (
            <div className="paper rounded-xl p-6 text-sm text-muted-foreground">
              No hay resultados para "{searchQuery}".
            </div>
          ) : (
            searchResults.map(({ item, pathNames }) => (
              <div
                key={item.id}
                className="paper rounded-xl p-4 hover:border-primary/50 transition-smooth"
                onClick={item.kind === "file" ? () => openExternal(item.externalUrl) : undefined}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg p-2 bg-primary/10 text-primary">
                    {item.kind === "folder" ? <Folder className="h-5 w-5" /> : <FileTypeIcon type={item.fileType} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{pathNames.join(" / ")}</p>
                    {item.kind === "file" ? (
                      <>
                        <p className="text-xs text-muted-foreground mt-2">
                          {item.subject} · {item.unit} · {item.fileType.toUpperCase()}
                        </p>
                        <Button asChild size="sm" className="mt-3 w-full bg-primary hover:bg-primary/90 text-white">
                          <a
                            href={item.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {item.actionLabel}
                          </a>
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 w-full border-primary/40 text-primary hover:bg-primary/10"
                        onClick={() => {
                          setFolderPath([...folderPath, item.id]);
                          setSearchQuery("");
                        }}
                      >
                        Abrir carpeta
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentFolder.children.map((item) => (
            <div
              key={item.id}
              className="paper rounded-xl p-4 hover:border-primary/50 hover:-translate-y-0.5 transition-smooth"
              onClick={item.kind === "file" ? () => openExternal(item.externalUrl) : undefined}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg p-2 bg-primary/10 text-primary">
                  {item.kind === "folder" ? <Folder className="h-5 w-5" /> : <FileTypeIcon type={item.fileType} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">{item.name}</p>

                  {item.kind === "folder" ? (
                    <>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.children.length} elemento{item.children.length !== 1 ? "s" : ""}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 w-full border-primary/40 text-primary hover:bg-primary/10"
                        onClick={() => setFolderPath([...folderPath, item.id])}
                      >
                        Abrir carpeta
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.subject} · {item.unit} · {item.fileType.toUpperCase()}
                      </p>
                      <Button asChild size="sm" className="mt-3 w-full bg-primary hover:bg-primary/90 text-white">
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {item.actionLabel}
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Apuntes;
