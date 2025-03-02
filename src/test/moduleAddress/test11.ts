
import { ModuleAddress } from "../../lib/ModuleAddress";

import * as inDepth from "evt/tools/inDepth";
import { assert } from "evt/tools/typeSafety";
import { getCurrentStdVersion } from "../../lib/getCurrentStdVersion";

//When this is installed: https://www.npmjs.com/package/buffer 
//We should still resolve the std without trying to match the version
(async () => {

    const moduleAddress: ModuleAddress.DenoLandUrl = {
        "type": "DENO.LAND URL",
        "isStd": true,
        "baseUrlWithoutBranch": "https://deno.land/std",
        "branch": undefined,
        "pathToIndex": "node/buffer.ts"
    };

    assert(
        inDepth.same(
            ModuleAddress.parse("https://deno.land/std/node/buffer.ts"),
            moduleAddress
        )
    );

    assert(
        inDepth.same(
            ModuleAddress.parse("https://deno.land/std@master/node/buffer.ts"),
            { ...moduleAddress, "branch": "master" }
        )
    );


    {

        const getValidImportUrlFactoryResult = await ModuleAddress.getValidImportUrlFactory({
            moduleAddress,
            "desc": "MATCH VERSION INSTALLED IN NODE_MODULE",
            "version": "0.55.0"
            //https://deno.land/std/node/buffer.ts we voluntarily take a version that exist 
            //on deno.land ( event if it is note a valid npm buffer version).
            //to ensure that it does not resolve.
        });

        assert(getValidImportUrlFactoryResult.couldConnect === true);

        assert(
            getValidImportUrlFactoryResult.isDenoified === false &&
            getValidImportUrlFactoryResult.versionFallbackWarning === undefined
        );

        assert(
            await getValidImportUrlFactoryResult.getValidImportUrl({ "target": "DEFAULT EXPORT" })
            ===
            `https://deno.land/std@${await getCurrentStdVersion()}/node/buffer.ts`
        );


    }

    console.log("PASS");

})();