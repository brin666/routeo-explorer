# Licensing scope and third-party materials

## Routeo source code

Original Routeo application code and project-authored developer documentation are
available under the [MIT License](./LICENSE), except where a file carries another
notice or incorporates separately licensed material. The MIT grant covers only
material that the Routeo authors have the right to license.

## Maps, photographs and travel references

The root MIT License does **not** grant a blanket license to illustrations,
photographs, menu images, screenshots, source-note text, logos or other media
under `assets/` or elsewhere in this repository. This includes generated map
artwork. These materials are included for the travel demonstration and retain
their individual provenance and any applicable terms.

Photograph and reference records retain author/source links and permission
metadata in the route modules, including `assets/routes/photo-notes-data.js`,
`assets/routes/dining-data.js` and batch update modules. Some photographs have
unconfirmed reuse permission. Attribution alone does not resolve that status;
do not interpret repository visibility or a source link as permission to reuse.
Check the individual source or supply your own cleared assets when republishing.

## Runtime dependencies and committed browser bundles

`assets/routeo-photo-deck.js` and `assets/routeo-remotion.js` include third-party
runtime code. Their dependency portions retain upstream terms, independently of
Routeo's original code:

| Dependency | Locked version | Terms |
| --- | --- | --- |
| React / React DOM | 19.3.0 | MIT; [included upstream notice](./licenses/react-MIT.txt) |
| Remotion / @remotion/player | 4.0.533 | Remotion License; [included upstream license](./licenses/remotion-LICENSE.md) |

The notices above are copied from the installed packages used by this checkout.
Remotion has its own eligibility and company-license terms; Routeo does not
relicense Remotion under MIT. Check those terms for your intended use and check
again when updating dependencies. Other build dependencies retain the licenses
in their installed packages and `package-lock.json`.

## Corrections and material removal

For a broken credit, material-rights concern or removal request, open a
[GitHub issue](https://github.com/brin666/routeo-explorer/issues) with the route,
asset or source URL concerned. Do not include private credentials or cookies.
