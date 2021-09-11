# tune-in
A radio for $TUNE songs from the ethereum blockchain. 

## Vision
A pirate radio exclusive to $TUNE nft owners. Listen to other songs created by artists for their own $TUNE.

## Implementation Ideas 
@aeolus
- As an initial MVP, only log in with metamask for people who own a tune NFT. 
- We can host the music on IPFS. 
- Everything that interacts with the NFT along with metadata and such can be done via web3.js. 

@donaldbough
- Actual radio station website hosted from a regular web2 web server (firebase hosting's easy + generous free layer).
- Need to look into IPFS media player libraries to play the song in our radio station website.

@sudo
- TUNES metadata could have a link for the song in Sound Cloud or Spotify.
- Soundcloud links would be a great since we could stream them via api, and have an MVP. 

## @donaldbough thoughts for MVP
* MVP
    * Restrict website access based on tunes owner
        * every page has to redirect before running scripts
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
