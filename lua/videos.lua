-- AO Video Links Process

-- Load JSON library (standard in aos)
local json = require("json")

-- Video Data: A list of videos with their embed URLs and titles
Videos = {
  {
    id = "v1",
    title = "ARIO Swag Airdrop",
    embedUrl = "https://odysee.com/$/embed/@PSkinnerTech:0/ario-swag-airdrop:6?r=DFNZZR62iU1rSBQePXCC9jwwsopGXNNW"
  },
  {
    id = "v2",
    title = "Moving CRED from AO Process to Arweave",
    embedUrl = "https://odysee.com/$/embed/@PSkinnerTech:0/moving-cred-from-ao-process-to-arweave:0?r=DFNZZR62iU1rSBQePXCC9jwwsopGXNNW"
  },
  {
    id = "v3",
    title = "Creating Handlers Functions Inside AOS",
    embedUrl = "https://odysee.com/$/embed/@PSkinnerTech:0/creating-handlers-functions-inside-aos:7?r=DFNZZR62iU1rSBQePXCC9jwwsopGXNNW"
  },
  {
    id = "v4",
    title = "How to Find the Quest Board in AOS",
    embedUrl = "https://odysee.com/$/embed/@PSkinnerTech:0/how-to-find-the-quest-board-in-aos:b?r=DFNZZR62iU1rSBQePXCC9jwwsopGXNNW"
  },
  {
    id = "v5",
    title = "AO+AOS Setting Up Your Text Editor (June)",
    embedUrl = "https://odysee.com/$/embed/@PSkinnerTech:0/ao%2Baos-setting-up-your-text-editor-%28june:4?r=DFNZZR62iU1rSBQePXCC9jwwsopGXNNW"
  }
}

-- Handler to get all video links
Handlers.add(
  "GetVideos",
  Handlers.utils.hasMatchingTag("Action", "GetVideos"),
  function(msg)
    print("==== GetVideos Handler Triggered ====")
    print("  From: " .. msg.From)
    Handlers.utils.reply(json.encode(Videos))(msg)
    print("==== GetVideos Handler Finished ====")
  end
)

-- Helper function to count items in Videos table (optional, but good for consistency)
local function countVideos()
  local count = 0
  for i, v in ipairs(Videos) do
    count = count + 1
  end
  return count
end

print("Video Links process loaded (" .. countVideos() .. " videos). Waiting for messages...") 