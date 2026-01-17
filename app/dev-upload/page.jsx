"use client";
import React, { useState, useEffect } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function UploadPage() {
  const [token, setToken] = useState("");
  const [modelsMap, setModelsMap] = useState({});
  const [allModels, setAllModels] = useState([]);
  const [searchableFieldsMap, setSearchableFieldsMap] = useState({});
  const [model, setModel] = useState("");
  const [searchField, setSearchField] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [field, setField] = useState("");
  const [docId, setDocId] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaError, setSchemaError] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedImagesToReplace, setSelectedImagesToReplace] = useState({});
  const [fieldStructure, setFieldStructure] = useState(null); 
  const [colorVariants, setColorVariants] = useState([]); 
  const [selectedColorIdx, setSelectedColorIdx] = useState(null); 

  async function handleUpload(e) {
    e.preventDefault();
    if (!docId) return alert("Select a document");
    if (!field) return alert("Select a field");
    if (!files || files.length === 0) return alert("Pick one or more files");

    if (fieldStructure === "array-of-objects") {
      if (selectedColorIdx === null || selectedColorIdx === undefined) {
        return alert(
          "❌ Error: This is an array field with nested objects.\n\nYou must select a variant/item first (see the variant selector above).\n\nIf no variants appear, this field may not be supported for direct image upload."
        );
      }
      if (!colorVariants[selectedColorIdx]?.color) {
        return alert("Invalid variant selected");
      }
    }

    const fd = new FormData();
    for (const f of files) fd.append("file", f);
    fd.append("field", field);

    // For array-of-objects, send the filter key and value (e.g., color variant)
    if (fieldStructure === "array-of-objects") {
      // Send filterKey and filterValue to identify which object in array to update
      fd.append("filterKey", "color");
      fd.append("filterValue", colorVariants[selectedColorIdx]?.color || "");
      // Also send colorIndex for backend reference
      fd.append("colorIndex", selectedColorIdx);
      console.log(
        `📤 Uploading to array-of-objects field with color variant: ${colorVariants[selectedColorIdx]?.color}`
      );
    }

  
    const indicesToReplace = Object.keys(selectedImagesToReplace)
      .map((k) => parseInt(k))
      .filter((idx) => selectedImagesToReplace[idx]);

    if (indicesToReplace.length > 0) {
      fd.append("replaceIndices", JSON.stringify(indicesToReplace));
      console.log(`📤 Replacing ${indicesToReplace.length} image(s)`);
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `${apiBase}/api/admin/doc/${model}/${docId}/upload`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        }
      );
      const json = await res.json();
      setResult({ status: res.status, body: json });
      if (res.ok) {
        setFiles(null);
        setSelectedImagesToReplace({});
        if (selectedDoc) loadExistingImages(selectedDoc);
      }
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  // Search documents by specific field
  async function searchDocuments() {
    if (!searchField) {
      alert("Select a search field first");
      return;
    }
    if (!searchQuery.trim()) {
      alert("Enter a search value");
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `${apiBase}/api/admin/doc/${model}/search?field=${encodeURIComponent(
          searchField
        )}&q=${encodeURIComponent(searchQuery)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) {
        const text = await res.text();
        alert(
          `Error: ${res.status} ${res.statusText}\n\nMake sure backend is running on ${apiBase}`
        );
        setSearchResults([]);
        setSearching(false);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        alert(
          `Invalid Response: Backend returned non-JSON content\n\nCheck your API URL: ${apiBase}`
        );
        setSearchResults([]);
        setSearching(false);
        return;
      }

      const json = await res.json();
      if (json && json.results) {
        setSearchResults(json.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      alert(`Search Failed: ${err.message}`);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  async function selectDocument(doc) {
    setSelectedDoc(doc);
    setDocId(doc._id);
    setSearchQuery(doc.name || doc.title || doc.productName || "");
    setSearchResults([]);

    try {
      const res = await fetch(`${apiBase}/api/admin/doc/${model}/${doc._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        const fullDoc = data.doc || data;
        setSelectedDoc(fullDoc);
      } else {
        console.warn("Could not fetch full document, using search result");
      }
    } catch (err) {
      console.warn("Failed to fetch full document:", err);
    }
  }

  // Helper function to get nested field value using dot notation
  function getNested(obj, path) {
    if (!path) return obj;
    return path.split(".").reduce((current, part) => current?.[part], obj);
  }

  // Load existing images from selected document
  function loadExistingImages(doc) {
    if (!field) return;

    const fieldValue = getNested(doc, field);
    console.log(`📸 Loading images for field "${field}":`, fieldValue);

    // Detect field structure
    if (Array.isArray(fieldValue)) {
      if (fieldValue.length === 0) {
        console.log("  → Empty array");
        setFieldStructure(null);
        setExistingImages([]);
        setColorVariants([]);
        setSelectedColorIdx(null);
        return;
      }

      const firstElement = fieldValue[0];

      const isColorVariant =
        typeof firstElement === "object" &&
        firstElement !== null &&
        "color" in firstElement &&
        "images" in firstElement &&
        Array.isArray(firstElement.images);

      if (isColorVariant) {
        // Array of objects with color variants
        console.log("  → Detected array-of-objects with color variants");
        setFieldStructure("array-of-objects");
        setColorVariants(
          fieldValue.map((v, idx) => ({
            idx,
            color: (v.color || "").trim() || `Variant ${idx + 1}`,
            images: Array.isArray(v.images) ? v.images : [],
            count: Array.isArray(v.images) ? v.images.length : 0,
          }))
        );
        // Select first color variant by default
        console.log("  → Selected first color variant (index 0)");
        setSelectedColorIdx(0);
        setExistingImages(fieldValue[0].images || []);
        setSelectedImagesToReplace({});
      } else if (typeof firstElement === "string") {
        // Simple array of strings
        console.log("  → Detected simple array of strings");
        setFieldStructure("simple-array");
        setExistingImages(fieldValue);
        setColorVariants([]);
        setSelectedColorIdx(null);
        setSelectedImagesToReplace({});
      } else if (typeof firstElement === "object" && firstElement !== null) {
        // Array of objects but NOT color variants
        // This could be other nested object types
        console.log("  → Detected array-of-objects (generic)");
        console.log("     First element keys:", Object.keys(firstElement));

        // Try to find any image-like field in the object
        const imageFields = Object.keys(firstElement).filter(
          (key) =>
            key.toLowerCase().includes("img") ||
            key.toLowerCase().includes("image") ||
            key.toLowerCase().includes("url") ||
            key.toLowerCase().includes("src")
        );

        if (imageFields.length > 0) {
          console.log(`     Found image field(s): ${imageFields.join(", ")}`);
          // Mark as array-of-objects but don't set color variants
          setFieldStructure("array-of-objects");
          setColorVariants([]);
          setSelectedColorIdx(null);
          setExistingImages([]);
          setSelectedImagesToReplace({});
        } else {
          console.log("     ⚠️  No image fields found in this object array");
          setFieldStructure("array-of-objects");
          setColorVariants([]);
          setSelectedColorIdx(null);
          setExistingImages([]);
          setSelectedImagesToReplace({});
        }
      } else {
        // Other array type
        console.log("  → Detected other array type");
        setFieldStructure("simple-array");
        setExistingImages([]);
        setColorVariants([]);
        setSelectedColorIdx(null);
      }
    } else if (typeof fieldValue === "string" && fieldValue) {
      console.log("  → Detected simple string");
      setFieldStructure("simple-string");
      setExistingImages([fieldValue]);
      setColorVariants([]);
      setSelectedColorIdx(null);
      setSelectedImagesToReplace({});
    } else {
      console.log("  → No field value or unsupported type");
      setFieldStructure(null);
      setExistingImages([]);
      setColorVariants([]);
      setSelectedColorIdx(null);
    }
  }

  // load model->fields mapping
  async function loadSchemaFields() {
    setSchemaLoading(true);
    setSchemaError(null);
    try {
      // Get image fields for each model
      const imageRes = await fetch(`${apiBase}/api/admin/schema-image-fields`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!imageRes.ok) throw new Error(`Image fields HTTP ${imageRes.status}`);
      const imageJson = await imageRes.json();
      console.log("✅ Schema image fields response:", imageJson);
      if (imageJson && imageJson.models) {
        setModelsMap(imageJson.models);
        console.log("✅ Loaded models map:", Object.keys(imageJson.models));
      }

      // Get all registered models (complete list)
      const allModelsRes = await fetch(
        `${apiBase}/api/admin/schema-all-models`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!allModelsRes.ok)
        throw new Error(`All models HTTP ${allModelsRes.status}`);
      const allModelsJson = await allModelsRes.json();
      console.log("✅ All registered models from backend:", allModelsJson);
      if (allModelsJson && allModelsJson.models) {
        setAllModels(allModelsJson.models);
        console.log(
          `📊 Total models available: ${allModelsJson.models.length}`
        );
      }

      setSchemaError(null);
    } catch (err) {
      console.error("❌ Failed to load schema fields:", err);
      setSchemaError(`Configuration load failed: ${err.message}`);
      setModelsMap({});
      setAllModels([]);
    } finally {
      setSchemaLoading(false);
    }
  }

  // Load searchable fields (String fields for search)
  async function loadSearchableFields() {
    try {
      const res = await fetch(`${apiBase}/api/admin/schema-searchable-fields`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        console.error(`Failed to load searchable fields: HTTP ${res.status}`);
        return;
      }

      const json = await res.json();
      console.log("✅ Searchable fields response:", json);

      if (json && json.searchableFields) {
        setSearchableFieldsMap(json.searchableFields);
        console.log("✅ Set searchableFieldsMap:", json.searchableFields);
      } else {
        console.warn("⚠️ No searchableFields in response:", json);
      }
    } catch (err) {
      console.error("❌ Error loading searchable fields:", err);
    }
  }

  // refresh mapping when component mounts and when token changes
  useEffect(() => {
    console.log("🔄 Loading schemas on mount/token change...");
    loadSchemaFields();
    loadSearchableFields();
  }, [token]);

  // Also load on initial mount
  useEffect(() => {
    console.log("🔄 Initial load on component mount");
    loadSchemaFields();
    loadSearchableFields();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "32px 24px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 700,
              color: "#1f2937",
            }}
          >
            Recover Images
          </h1>
          <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: 14 }}>
            Upload and manage your product images efficiently
          </p>
        </div>
      </div>

      {/* Admin Token - Hidden Section */}
      <div style={{ display: "none" }}>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Bearer token"
        />
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Status Bar */}
        {(schemaLoading ||
          schemaError ||
          Object.keys(modelsMap).length > 0) && (
          <div style={{ marginBottom: 24 }}>
            {schemaLoading && (
              <div
                style={{
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fcd34d",
                  borderRadius: 8,
                  padding: 12,
                  color: "#92400e",
                  fontSize: 14,
                }}
              >
                ⏳ Loading configuration...
              </div>
            )}
            {schemaError && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: 8,
                  padding: 12,
                  color: "#991b1b",
                  fontSize: 14,
                }}
              >
                ❌ {schemaError}
              </div>
            )}
            {Object.keys(modelsMap).length > 0 &&
              !schemaLoading &&
              !schemaError && (
                <div
                  style={{
                    backgroundColor: "#d1fae5",
                    border: "1px solid #6ee7b7",
                    borderRadius: 8,
                    padding: 12,
                    color: "#065f46",
                    fontSize: 14,
                  }}
                >
                  ✓ Ready to upload
                </div>
              )}
          </div>
        )}

        <form onSubmit={handleUpload}>
          <div style={{ display: "grid", gap: 24 }}>
            {/* Step 1: Select Model */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 24,
              }}
            >
              <label style={{ display: "block", marginBottom: 16 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1f2937",
                    marginBottom: 12,
                  }}
                >
                  1. Select Catalog
                </h3>
              </label>
              <select
                value={model}
                onChange={(e) => {
                  const newModel = e.target.value;
                  setModel(newModel);
                  // Reset search fields when model changes
                  setSearchField("");
                  setSearchQuery("");
                  setSearchResults([]);
                  setSelectedDoc(null);
                  setField("");
                  setDocId("");
                  setExistingImages([]);
                  setColorVariants([]);
                  setSelectedColorIdx(null);
                }}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                  color: "#1f2937",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                <option value="">
                  -- Select a catalog ({allModels.length} available) --
                </option>
                {allModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Search Field & Enter Value */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 24,
              }}
            >
              <label style={{ display: "block", marginBottom: 16 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1f2937",
                    marginBottom: 12,
                  }}
                >
                  2. Find Item
                </h3>
              </label>

              <div style={{ display: "grid", gap: 16 }}>
                {/* Select Search Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      marginBottom: 8,
                      fontWeight: 500,
                      color: "#374151",
                    }}
                  >
                    Search by:
                  </label>
                  <select
                    value={searchField}
                    onChange={(e) => {
                      setSearchField(e.target.value);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    disabled={!model}
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      fontSize: 14,
                      color: model ? "#1f2937" : "#9ca3af",
                      backgroundColor: "#fff",
                      cursor: model ? "pointer" : "not-allowed",
                      opacity: model ? 1 : 0.6,
                    }}
                  >
                    <option value="">-- Select a field --</option>
                    {model &&
                      searchableFieldsMap[model] &&
                      searchableFieldsMap[model].length > 0 && (
                        <>
                          {searchableFieldsMap[model].map((field) => (
                            <option key={field} value={field}>
                              {field}
                            </option>
                          ))}
                        </>
                      )}
                    {model &&
                      modelsMap[model] &&
                      modelsMap[model].length > 0 &&
                      (!searchableFieldsMap[model] ||
                        searchableFieldsMap[model].length === 0) && (
                        <>
                          <option disabled>
                            --- Image fields available ---
                          </option>
                          {modelsMap[model].map((field) => (
                            <option key={field.path} value={field.path}>
                              {field.path}
                            </option>
                          ))}
                        </>
                      )}
                    {model &&
                      (!modelsMap[model] || modelsMap[model].length === 0) &&
                      (!searchableFieldsMap[model] ||
                        searchableFieldsMap[model].length === 0) && (
                        <option disabled>No fields available</option>
                      )}
                  </select>
                </div>

                {/* Enter Value to Search For */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      marginBottom: 8,
                      fontWeight: 500,
                      color: "#374151",
                    }}
                  >
                    Search value:
                  </label>
                  <input
                    type="text"
                    placeholder={
                      searchField
                        ? `Search by ${searchField}...`
                        : "Select a field first"
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") searchDocuments();
                    }}
                    disabled={!model || !searchField}
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      fontSize: 14,
                      color: "#1f2937",
                      opacity: model && searchField ? 1 : 0.6,
                      cursor: model && searchField ? "text" : "not-allowed",
                      backgroundColor: "#fff",
                    }}
                  />
                </div>

                {/* Search Button */}
                <button
                  type="button"
                  onClick={searchDocuments}
                  disabled={
                    !model || !searchField || !searchQuery.trim() || searching
                  }
                  style={{
                    padding: 12,
                    backgroundColor:
                      model && searchField && searchQuery.trim() && !searching
                        ? "#3b82f6"
                        : "#d1d5db",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor:
                      model && searchField && searchQuery.trim() && !searching
                        ? "pointer"
                        : "not-allowed",
                    fontWeight: 600,
                    fontSize: 14,
                    transition: "background-color 0.2s",
                  }}
                >
                  {searching ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Results ({searchResults.length}):
                  </label>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 6,
                      maxHeight: 300,
                      overflowY: "auto",
                    }}
                  >
                    {searchResults.map((doc) => (
                      <div
                        key={doc._id}
                        onClick={() => selectDocument(doc)}
                        style={{
                          padding: 12,
                          cursor: "pointer",
                          borderBottom: "1px solid #f3f4f6",
                          backgroundColor:
                            selectedDoc?._id === doc._id ? "#eff6ff" : "#fff",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedDoc?._id !== doc._id) {
                            e.target.style.backgroundColor = "#f9fafb";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor =
                            selectedDoc?._id === doc._id ? "#eff6ff" : "#fff";
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 500,
                            color: "#1f2937",
                            fontSize: 14,
                          }}
                        >
                          {doc.name}
                        </div>
                        <div
                          style={{
                            color: "#9ca3af",
                            fontSize: 12,
                            marginTop: 4,
                          }}
                        >
                          ID: {doc._id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDoc && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 12,
                    backgroundColor: "#ecfdf5",
                    borderRadius: 6,
                    fontSize: 14,
                    color: "#047857",
                  }}
                >
                  ✓ <strong>{selectedDoc.name}</strong> selected
                </div>
              )}
            </div>

            {/* Step 3: Select Upload Field */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 24,
                opacity: selectedDoc ? 1 : 0.5,
                pointerEvents: selectedDoc ? "auto" : "none",
              }}
            >
              <label style={{ display: "block", marginBottom: 16 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1f2937",
                    marginBottom: 12,
                  }}
                >
                  3. Select Image Field
                </h3>
              </label>
              <select
                value={field}
                onChange={(e) => {
                  setField(e.target.value);
                  if (selectedDoc && e.target.value) {
                    loadExistingImages(selectedDoc);
                  }
                }}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                  color: "#1f2937",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              >
                <option value="">Select a field...</option>
                {model &&
                  modelsMap[model] &&
                  modelsMap[model].map((f) => (
                    <option key={f.path} value={f.path}>
                      {f.path} ({f.type})
                    </option>
                  ))}
              </select>
            </div>

            {/* Step 3a: Select Color Variant */}
            {selectedDoc &&
              field &&
              fieldStructure === "array-of-objects" &&
              colorVariants.length > 0 && (
                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 24,
                  }}
                >
                  <label style={{ display: "block", marginBottom: 16 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#1f2937",
                        marginBottom: 12,
                      }}
                    >
                      3a. Select Color Variant
                    </h3>
                  </label>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {colorVariants.map((variant) => (
                      <button
                        key={variant.idx}
                        type="button"
                        onClick={() => {
                          setSelectedColorIdx(variant.idx);
                          setExistingImages(variant.images);
                          setSelectedImagesToReplace({});
                        }}
                        style={{
                          padding: "10px 16px",
                          backgroundColor:
                            selectedColorIdx === variant.idx
                              ? "#3b82f6"
                              : "#f3f4f6",
                          color:
                            selectedColorIdx === variant.idx
                              ? "#fff"
                              : "#374151",
                          border:
                            "1px solid " +
                            (selectedColorIdx === variant.idx
                              ? "#3b82f6"
                              : "#d1d5db"),
                          borderRadius: 6,
                          cursor: "pointer",
                          fontWeight:
                            selectedColorIdx === variant.idx ? 600 : 500,
                          transition: "all 0.2s",
                          fontSize: 14,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: variant.color
                              .toLowerCase()
                              .includes("green")
                              ? "#22c55e"
                              : variant.color.toLowerCase().includes("blue")
                              ? "#3b82f6"
                              : variant.color.toLowerCase().includes("red")
                              ? "#ef4444"
                              : variant.color.toLowerCase().includes("white")
                              ? "#f5f5f5"
                              : variant.color.toLowerCase().includes("black")
                              ? "#1f2937"
                              : "#9ca3af",
                            border: "1px solid #ddd",
                          }}
                        />
                        {variant.color} ({variant.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Step 3.5: View & Select Existing Images */}
            {selectedDoc && field && existingImages.length > 0 && (
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 24,
                }}
              >
                <label style={{ display: "block", marginBottom: 16 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#1f2937",
                      marginBottom: 8,
                    }}
                  >
                    Current Images
                  </h3>
                  <small
                    style={{
                      color: "#6b7280",
                      fontWeight: 400,
                      display: "block",
                    }}
                  >
                    {existingImages.length} image
                    {existingImages.length !== 1 ? "s" : ""} - Click to replace
                  </small>
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  {existingImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedImagesToReplace((prev) => ({
                          ...prev,
                          [idx]: !prev[idx],
                        }));
                      }}
                      style={{
                        cursor: "pointer",
                        border: selectedImagesToReplace[idx]
                          ? "3px solid #10b981"
                          : "2px solid #e5e7eb",
                        borderRadius: 6,
                        overflow: "hidden",
                        backgroundColor: selectedImagesToReplace[idx]
                          ? "#ecfdf5"
                          : "#fff",
                        transition: "all 0.2s",
                        position: "relative",
                      }}
                    >
                      <img
                        src={img}
                        alt={`Image ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                          opacity: selectedImagesToReplace[idx] ? 0.6 : 1,
                        }}
                      />
                      {selectedImagesToReplace[idx] && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(16, 185, 129, 0.3)",
                            fontSize: 24,
                          }}
                        >
                          ✓
                        </div>
                      )}
                      <small
                        style={{
                          display: "block",
                          padding: "4px",
                          fontSize: "11px",
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          backgroundColor: "#f9fafb",
                        }}
                      >
                        #{idx + 1}
                      </small>
                    </div>
                  ))}
                </div>

                {Object.keys(selectedImagesToReplace).some(
                  (k) => selectedImagesToReplace[k]
                ) && (
                  <div
                    style={{ fontSize: 14, color: "#10b981", fontWeight: 600 }}
                  >
                    ✓{" "}
                    {
                      Object.values(selectedImagesToReplace).filter(Boolean)
                        .length
                    }{" "}
                    image(s) selected for replacement
                  </div>
                )}
              </div>
            )}

            {selectedDoc && field && existingImages.length === 0 && (
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <small style={{ color: "#1e40af", fontSize: 14 }}>
                  ℹ No existing images - You can add new ones
                </small>
              </div>
            )}

            {/* Step 4: Choose File */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 24,
                opacity: selectedDoc && field ? 1 : 0.5,
                pointerEvents: selectedDoc && field ? "auto" : "none",
              }}
            >
              <label style={{ display: "block", marginBottom: 16 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1f2937",
                    marginBottom: 8,
                  }}
                >
                  4. Choose Image File(s)
                </h3>
                {selectedDoc && field && (
                  <small
                    style={{
                      color: "#6b7280",
                      fontWeight: 400,
                      display: "block",
                      marginTop: 4,
                    }}
                  >
                    {Object.keys(selectedImagesToReplace).some(
                      (k) => selectedImagesToReplace[k]
                    )
                      ? `Replace ${
                          Object.values(selectedImagesToReplace).filter(Boolean)
                            .length
                        } image(s)`
                      : "Add new image(s) to the collection"}
                  </small>
                )}
              </label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => setFiles(e.target.files || null)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 6,
                  border: "2px dashed #d1d5db",
                  backgroundColor: "#f9fafb",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              />
              {files && (
                <small
                  style={{
                    color: "#10b981",
                    marginTop: 8,
                    display: "block",
                    fontWeight: 500,
                  }}
                >
                  ✓ {files.length} file(s) selected
                </small>
              )}
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={
                loading ||
                !selectedDoc ||
                !field ||
                !files ||
                (fieldStructure === "array-of-objects" &&
                  (selectedColorIdx === null || selectedColorIdx === undefined))
              }
              style={{
                padding: "14px 32px",
                backgroundColor:
                  selectedDoc &&
                  field &&
                  files &&
                  !loading &&
                  !(
                    fieldStructure === "array-of-objects" &&
                    (selectedColorIdx === null ||
                      selectedColorIdx === undefined)
                  )
                    ? "#3b82f6"
                    : "#d1d5db",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor:
                  selectedDoc &&
                  field &&
                  files &&
                  !loading &&
                  !(
                    fieldStructure === "array-of-objects" &&
                    (selectedColorIdx === null ||
                      selectedColorIdx === undefined)
                  )
                    ? "pointer"
                    : "not-allowed",
                fontSize: 16,
                fontWeight: 600,
                transition: "background-color 0.2s",
                width: "100%",
              }}
            >
              {loading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
        </form>
        {result && (
          <div
            style={{
              marginTop: 24,
              padding: 16,
              backgroundColor: result.status === 200 ? "#ecfdf5" : "#fee2e2",
              borderRadius: 8,
              borderLeft: `4px solid ${
                result.status === 200 ? "#10b981" : "#ef4444"
              }`,
            }}
          >
            <h4
              style={{
                margin: "0 0 8px 0",
                color: result.status === 200 ? "#047857" : "#991b1b",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {result.status === 200 ? "✓ Success" : "✗ Error"}
            </h4>
            <pre
              style={{
                fontSize: 12,
                whiteSpace: "pre-wrap",
                margin: 0,
                color: "#374151",
              }}
            >
              {JSON.stringify(result.body || result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
