import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedTab, setSelectedTab] = useState("contentRewrite");
  const [entries, setEntries] = useState([
    { links: "", content: "", result: "" },
  ]);
  const [limitLength, setLimitLength] = useState("300");
  const [limitLengthMin, setLimitLengthMin] = useState("250");
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState("");
  const [results, setResults] = useState([]);

  const handleAddEntry = () => {
    setEntries([...entries, { links: "", content: "", result: "" }]);
  };

  const handleRemoveEntry = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleContentRewriteSubmit = async () => {
    setIsLoading(true);
    try {
      const formattedEntries = entries.map((entry) => ({
        links: entry.links.split("\n").filter((link) => link.trim() !== ""),
        customContent: entry.content.trim(),
      }));

      const response = await axios.post(
        "http://dautubenvung.duckdns.org:5090/api/fetch-content",
        // "http://dautubenvung.duckdns.org:5080/api/fetch-content",
        {
          entries: formattedEntries,
          limitLength: parseInt(limitLength) || null,
          limitLengthMin: parseInt(limitLengthMin) || null,
          type: "kinhTe",
        }
      );

      const newEntries = [...entries];
      response.data.content.forEach((result, index) => {
        newEntries[index].result = result;
      });
      setEntries(newEntries);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
    setIsLoading(false);
  };

  const handleLinkToTextSubmit = async () => {
    setIsLoading(true);
    try {
      const linkArray = links.split("\n").filter((link) => link.trim() !== "");
      const response = await axios.post(
        "http://dautubenvung.duckdns.org:4040/api/fetch-content",
        { links: linkArray }
      );
      setResults(response.data.content || []);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ padding: "20px", paddingRight: "40px" }}>
      <h2>Chọn Tab</h2>
      <div>
        <button
          style={{ marginRight: "20px" }}
          onClick={() => setSelectedTab("contentRewrite")}
        >
          Viết lại content Kinh tế
        </button>
        <button onClick={() => setSelectedTab("linkToText")}>
          Chuyển link thành văn bản
        </button>
      </div>

      {selectedTab === "contentRewrite" && (
        <div>
          <h2>Nhập nội dung cho các bài viết:</h2>
          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Giới hạn số từ tối thiểu cho kết quả:</strong>
            </label>
            <input
              type="number"
              value={limitLengthMin}
              onChange={(e) => setLimitLengthMin(e.target.value)}
              placeholder="Nhập số từ giới hạn"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Giới hạn số từ tối đa cho kết quả:</strong>
            </label>
            <input
              type="number"
              value={limitLength}
              onChange={(e) => setLimitLength(e.target.value)}
              placeholder="Nhập số từ giới hạn"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            />
          </div>

          {entries.map((entry, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              <h3>Bài viết {index + 1}</h3>

              <h4>
                Nhập các đường link báo hoặc bài viết (mỗi dòng một link):
              </h4>
              <textarea
                rows="3"
                value={entry.links}
                onChange={(e) =>
                  handleEntryChange(index, "links", e.target.value)
                }
                placeholder="Nhập link ở đây..."
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              ></textarea>

              <h4>Nhập đoạn nội dung sẵn có:</h4>
              <textarea
                rows="3"
                value={entry.content}
                onChange={(e) =>
                  handleEntryChange(index, "content", e.target.value)
                }
                placeholder="Nhập nội dung ở đây..."
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "20px",
                  height: "400px",
                }}
              ></textarea>

              <button
                onClick={() => handleRemoveEntry(index)}
                style={{ marginBottom: "10px", marginRight: "10px" }}
              >
                Xóa bài viết {index + 1}
              </button>

              {entry.result && (
                <div style={{ marginTop: "10px" }}>
                  <h4>Kết quả viết lại:</h4>
                  <textarea
                    rows="3"
                    value={entry.result}
                    onChange={(e) =>
                      handleEntryChange(index, "result", e.target.value)
                    }
                    placeholder="Nhập nội dung ở đây..."
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "20px",
                      height: "400px",
                    }}
                  ></textarea>
                </div>
              )}
            </div>
          ))}

          <button onClick={handleAddEntry} style={{ marginBottom: "20px" }}>
            + Thêm bài viết
          </button>

          <button onClick={handleContentRewriteSubmit} disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Xác nhận"}
          </button>
        </div>
      )}

      {selectedTab === "linkToText" && (
        <div>
          <h2>Nhập danh sách các link:</h2>
          <textarea
            rows="5"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            placeholder="Nhập mỗi link một dòng (TikTok, YouTube)..."
            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
          ></textarea>

          <button onClick={handleLinkToTextSubmit} disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Xác nhận"}
          </button>

          {results.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h3>Kết quả nội dung:</h3>
              {results.map((result, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "20px",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "10px",
                  }}
                >
                  <h4>Link {index + 1}:</h4>
                  <p
                    style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                  >
                    {result}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
