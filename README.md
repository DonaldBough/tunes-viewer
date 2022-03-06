# Overview
The Tunes NFT (https://tunesproject.org/) was created as a way to inspire artists to make songs based off the AI generated song titles with each NFT. After artists began attaching songs to their Tune NFT as a derivative, we needed a way to listen to them.

The Tunes Viewer allows anyone to view the songs, artwork, lyrics, and all other media attached to a Tune NFT, as well as let users share their collection of Tunes with a simple link.

# Demo
https://user-images.githubusercontent.com/5701552/156943540-8565e7c4-acd5-405b-b20b-a3fbcd169424.mp4

Website is also live at https://tunes-viewer.web.app/

# Vision
A interactive pirate radio for Tune songs & portal to the creativity of the Tunes ecosystem.

# Making Changes
Project is using plain vanilla JS, bootstrap, Sentry.io (error monitoring), font awesome, and firebase. 

To run the project, `cd` to the `public` folder, and run `npm run local` to have firebase run a local web server for you on port 5000 (localhost:5000)

To deploy changes to the live website, make sure you're in the public folder like before and run `npm run deploy`

# Implementation Ideas 
@aeolus
- As an initial MVP, only log in with metamask for people who own a tune NFT. 
- We can host the music on IPFS. 
- Everything that interacts with the NFT along with metadata and such can be done via web3.js. 

@donaldbough
- Actual radio station website hosted from a regular web2 web server (firebase hosting's easy + generous free layer).
- Need to look into IPFS media player libraries to play the song in our radio station website.
- UI should feel exclusive & high end

@sudo
- TUNES metadata could have a link for the song in Sound Cloud or Spotify.
- Soundcloud links would be a great since we could stream them via api, and have an MVP. 

@0xAd1
- Can be maintained as a platform to view all possible derivates of the TUNES
- Users which have official metadata alias reserved by the team can contact, get their aliases added
- All sorts of artworks, songs, lyrics for a token visible on a single page
- If a derivative allows an owner to set their own metadata, we can have metamask connection which allows user to do so
- Allow the derivative owner to claim the derivative using metamask transaction

@m_r0che
- Two core habit loops: Discover music & Create music
- Initial solution hypos for Discover music: Browse deriv. ecosystem, Music Player, Recommended Originals and Remixes.
- Initial solution hypos for Create music: Find a Tune to remix, Match with Tune holders to make originals, Listening activity (likes, follows etc..), Creator profile.
- Discover music: Trigger = "I want to discover new high quality music" -> Action = Like / Favourite a song / Favourite a Tune -> Reward = Entertained & discovered new music
- Create music: Trigger = "I want to make and own a song based on a Tune" -> Action = Make Original or Remix -> Reward = Financial / Social Capital
- Manufactured habit loop for 'Discover music': New track added / Daily creations, medium = email/discord/twitter, when? start of day?
- Manufactured haibt loop for 'Create music' Suggested collabs / Challenges, medium = email/discord/twitter, when? start of day?
- Viewer nurtures listeners or creators to buy a Tune or invest somehow in a Tune. I think 10x experience for listener happens when you have some ownership stake... Gas fees are a blocker here.
- Can we improve Tune & deriv liquidity by providing some additional utility / social value to being a holder? Exclusive access to creator jam sessions?
- Acquisition of new listeners will happen via sharing of content. How do we make sharing content easy?
- Acquisition of creators can be kickstarted by existing network of community then word of mouth / content sharing. This happens when creators believe in project or they sell an Original or Remix. Crypto/NFT knowledge will be a barrier for adoption here. Get new creator to remix a Tune asap (perhaps with collab with existing creator for knowledge transfer). Perhaps best Remix in cohort, voted by holders, get promoted to Original... "New creator remix battle"


# @donaldbough thoughts for MVP
* MVP
    * play the song url associated with a tunes nft.
        * Only play sound cloud songs to start.
        * best and prettiest media player library is amplitude js: https://521dimensions.com/open-source/amplitudejs
        * show album cover in media player
            * This comes from tunes meta data
        * show part of ipfs link
        * show owner
    * player can shuffle to next tunes that has a song
    * tune owner can edit their tune's song_uri to a Soundcloud url
        * upload button has instructions explaining only sound cloud urls will play in the media player
        * input for Soundcloud url
        * upload button edits the actual tune's meta data
        * multiple uploads for the same song should just edit the existing meta data
* After MVP
    * Gallery of album art
    * Upvoting on songs
        * Page of best voted songs
    * ? (wait for suggestions from community)
