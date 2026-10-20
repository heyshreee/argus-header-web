import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import { Callout, DocHeader, DocSection, DocSubheading, DocTOC } from '../components/DocBlocks'
import { ExternalLink } from '../components/Links'
import {
  INSTALL_COMMAND,
  LINKS,
  PRODUCT,
  VERIFY_COMMAND,
  VERIFY_OUTPUT,
} from '../data/site'

const TOC = [
  { href: '#requirements', label: 'Requirements' },
  { href: '#from-pypi', label: 'Install from PyPI' },
  { href: '#virtual-environment', label: 'Use a virtual environment' },
  { href: '#verify', label: 'Verify the install' },
  { href: '#from-source', label: 'Install from source' },
  { href: '#upgrade', label: 'Upgrade or pin a version' },
  { href: '#troubleshooting', label: 'Troubleshooting' },
  { href: '#uninstall', label: 'Uninstall' },
]

export default function Installation() {
  return (
    <>
      <DocHeader
        eyebrow="Getting started · 01"
        title="Installation"
        lead="Argus Header is a standard Python package. Install it from PyPI, verify the console command, and run the CLI from any directory. The published stable release is 0.8.0."
      />

      <DocTOC items={TOC} />

      <DocSection id="requirements" title="Requirements" kicker="Before you install">
        <div className="doc-spec-grid">
          <div>
            <span className="data-label">Python</span>
            <strong>3.9 or newer</strong>
            <p>Classifiers cover Python 3.9 through 3.12.</p>
          </div>
          <div>
            <span className="data-label">Package manager</span>
            <strong>pip</strong>
            <p>A current pip inside the environment is recommended.</p>
          </div>
          <div>
            <span className="data-label">Runtime dependencies</span>
            <strong>requests · rich · pyyaml</strong>
            <p>
              Installed automatically: <code>requests&gt;=2.32.0</code>,{' '}
              <code>rich&gt;=13.7.0</code>, <code>pyyaml&gt;=6.0.0</code>.
            </p>
          </div>
          <div>
            <span className="data-label">Network</span>
            <strong>Outbound HTTP(S)</strong>
            <p>
              Needed for PyPI during installation and for the target during a
              scan.
            </p>
          </div>
        </div>

        <Callout tone="info" title="Check your Python version">
          Run <code>python --version</code> (or <code>python3 --version</code> on
          systems where <code>python</code> is not Python 3). If the version is
          below 3.9, install a newer interpreter before continuing.
        </Callout>
      </DocSection>

      <DocSection id="from-pypi" title="Install from PyPI" kicker="Recommended">
        <p>
          Install the latest published release into the active Python
          environment:
        </p>
        <CodeBlock code={INSTALL_COMMAND} language="bash" filename="shell" />
        <p>
          On systems where Python 3 is exposed as <code>python3</code>, the
          module form is equivalent and avoids ambiguity about which
          interpreter receives the package:
        </p>
        <CodeBlock
          code={`python3 -m pip install ${PRODUCT.packageName}`}
          language="bash"
          filename="shell"
        />
        <p>
          The package installs one console command,{' '}
          <code>argus-header</code>, and a module entry point,{' '}
          <code>python -m argus_header</code>. It does not require Node.js, a
          browser or a background service.
        </p>
        <div className="doc-inline-links">
          <ExternalLink href={LINKS.pypi} className="text-link">
            View {PRODUCT.packageName} on PyPI
          </ExternalLink>
          <ExternalLink href={LINKS.releases} className="text-link">
            GitHub release notes
          </ExternalLink>
        </div>
      </DocSection>

      <DocSection id="virtual-environment" title="Use a virtual environment" kicker="Isolated install">
        <p>
          A virtual environment keeps Argus and its dependencies separate from
          your system Python. This is optional, but recommended on development
          machines.
        </p>

        <DocSubheading id="venv-create">Create and activate</DocSubheading>
        <CodeBlock
          code={`python -m venv .venv`}
          language="bash"
          filename="create the environment"
        />

        <div className="doc-platform-grid">
          <div className="doc-platform">
            <span className="data-label">Linux / macOS</span>
            <CodeBlock
              code={`source .venv/bin/activate`}
              language="bash"
              filename="activate"
            />
          </div>
          <div className="doc-platform">
            <span className="data-label">Windows · PowerShell</span>
            <CodeBlock
              code={`.venv\\Scripts\\Activate.ps1`}
              language="powershell"
              filename="activate"
            />
          </div>
          <div className="doc-platform">
            <span className="data-label">Windows · cmd.exe</span>
            <CodeBlock
              code={`.venv\\Scripts\\activate.bat`}
              language="bat"
              filename="activate"
            />
          </div>
        </div>

        <p>Then install the package inside the activated environment:</p>
        <CodeBlock code={INSTALL_COMMAND} language="bash" filename="install" />
        <Callout tone="info" title="PowerShell execution policy">
          If PowerShell blocks the activation script, either use the{' '}
          <code>cmd.exe</code> activation script or run the CLI through{' '}
          <code>python -m argus_header</code> from the environment. Changing the
          machine-wide execution policy is not required.
        </Callout>
      </DocSection>

      <DocSection id="verify" title="Verify the install" kicker="One command">
        <p>Ask the installed package for its version:</p>
        <CodeBlock
          code={VERIFY_COMMAND}
          language="bash"
          filename="shell"
          caption={`Expected output: ${VERIFY_OUTPUT}`}
        />
        <p>
          This prints <code>Argus Header 0.8.0</code> for the current stable
          release. The short flag <code>-v</code> is the version flag, not a
          verbose mode.
        </p>
        <CodeBlock
          code={`${VERIFY_COMMAND.replace('--version', '--help')}`}
          language="bash"
          filename="also useful"
          caption="Prints every option and a short set of usage examples."
        />
        <Callout tone="warning" title="Version mismatch after an upgrade">
          If the reported version is older than expected, the command may be
          resolving to a different interpreter or an old virtual environment.
          Compare <code>which argus-header</code> (Linux/macOS) or{' '}
          <code>where argus-header</code> (Windows) with{' '}
          <code>python -m pip show argus-header</code>.
        </Callout>
      </DocSection>

      <DocSection id="from-source" title="Install from source" kicker="For development">
        <p>
          Use a source checkout when you want to review the code, run the test
          suite or work on a change. The upstream repository currently declares
          the same <code>0.8.0</code> version that is published on PyPI, so a
          source install and a wheel install behave identically.
        </p>
        <CodeBlock
          code={`git clone ${LINKS.github}.git
cd argus-header
python -m venv .venv
source .venv/bin/activate
python -m pip install -e .`}
          language="bash"
          filename="source install"
          caption="On Windows, activate with .venv\\Scripts\\Activate.ps1 instead of source .venv/bin/activate."
        />
        <p>
          For the optional FastAPI layer, install the <code>api</code> extra.
          The CLI itself does not need it:
        </p>
        <CodeBlock
          code={`python -m pip install -e ".[api]"`}
          language="bash"
          filename="optional API dependencies"
        />
        <p>
          Contributors should install the development requirements and use the
          repository bootstrap or manual setup described in the{' '}
          <Link className="text-link" to="/contributing">
            contributing guide
          </Link>
          .
        </p>
      </DocSection>

      <DocSection id="upgrade" title="Upgrade or pin a version" kicker="Version control">
        <p>Upgrade to the newest published release:</p>
        <CodeBlock
          code={`python -m pip install --upgrade ${PRODUCT.packageName}`}
          language="bash"
          filename="upgrade"
        />
        <p>
          Reproducible environments should pin the release explicitly. The
          current stable version is {PRODUCT.versionLabel}:
        </p>
        <CodeBlock
          code={`python -m pip install ${PRODUCT.packageName}==${PRODUCT.version}`}
          language="bash"
          filename="pin the version"
        />
        <p>
          The package follows a pre-1.0 version series. Read the{' '}
          <Link className="text-link" to="/changelog">
            changelog
          </Link>{' '}
          before upgrading in automation, especially if you depend on report
          fields or terminal output.
        </p>
      </DocSection>

      <DocSection id="troubleshooting" title="Troubleshooting" kicker="Common issues">
        <dl className="doc-faq">
          <div>
            <dt>
              <code>argus-header: command not found</code>
            </dt>
            <dd>
              The console script directory is not on <code>PATH</code>, or the
              virtual environment is not active. Run{' '}
              <code>python -m argus_header --version</code> to confirm the
              package is installed, then activate the environment that contains
              it.
            </dd>
          </div>
          <div>
            <dt>
              <code>No module named argus_header</code>
            </dt>
            <dd>
              The package was installed into a different interpreter. Use{' '}
              <code>python -m pip install {PRODUCT.packageName}</code> with the
              same Python that runs the tool, and check{' '}
              <code>python -m pip show {PRODUCT.packageName}</code>.
            </dd>
          </div>
          <div>
            <dt>SSL or certificate errors during installation</dt>
            <dd>
              pip is failing to verify the package index connection. Check the
              system clock, proxy and certificate store. Do not disable TLS
              verification as a permanent fix.
            </dd>
          </div>
          <div>
            <dt>Permission denied while installing</dt>
            <dd>
              The interpreter is system-managed or not writable. Create and
              activate a virtual environment rather than installing globally
              with elevated privileges.
            </dd>
          </div>
          <div>
            <dt>The scan fails, but installation succeeded</dt>
            <dd>
              Installation only proves the CLI is present. Scan errors such as
              timeouts or connection failures are described in the{' '}
              <Link className="text-link" to="/docs/quickstart#errors">
                quick start
              </Link>
              .
            </dd>
          </div>
        </dl>
      </DocSection>

      <DocSection id="uninstall" title="Uninstall" kicker="Clean removal">
        <p>
          Remove the package from the environment where it was installed:
        </p>
        <CodeBlock
          code={`python -m pip uninstall ${PRODUCT.packageName}`}
          language="bash"
          filename="uninstall"
        />
        <p>
          This removes the Python package and console command. Reports you
          generated remain on disk; delete them separately if they contain
          sensitive target information.
        </p>
      </DocSection>
    </>
  )
}
