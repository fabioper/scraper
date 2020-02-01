import { FolderResource } from "./FolderResource";


(async () => {
    const novidades = await new FolderResource(/* Folder name */).ensureItWasCreated()
    const boletins = new FolderResource(/* Folder name */)
    await novidades.append(boletins)
})();
