# Snapshot report for `test/xsnap-store.test.js`

The actual snapshot is saved in `xsnap-store.test.js.snap`.

Generated by [AVA](https://avajs.dev).

## XS + SES snapshots are long-term deterministic

> initial snapshot

    {
      archiveWriteSeconds: undefined,
      compressSeconds: 0,
      dbSaveSeconds: 0,
      hash: 'bee3b82eebdde4c5c3774fb95b7efe88382f7dc4afab90b4e0e58add54d6b81c',
      uncompressedSize: 168387,
    }

> after SES boot - sensitive to SES-shim, XS, and supervisor

    {
      archiveWriteSeconds: undefined,
      compressSeconds: 0,
      dbSaveSeconds: 0,
      hash: '28fe74bac0d5c7348e6541957b8564005a803261fc79c4f341e0fda78d291440',
      uncompressedSize: 852923,
    }

> after use of harden() - sensitive to SES-shim, XS, and supervisor

    {
      archiveWriteSeconds: undefined,
      compressSeconds: 0,
      dbSaveSeconds: 0,
      hash: '7c0069b787c47d93431b4943320ab440f9b8dad0080a56b851208b17cc2f7c89',
      uncompressedSize: 853083,
    }
