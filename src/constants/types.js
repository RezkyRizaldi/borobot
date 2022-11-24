/**
 * @typedef {Object} Math
 * @property {String} symbol
 * @property {String} description
 * @property {String} [example]
 * @property {String} [result]
 */

/**
 * @typedef {Object} CovidLatest
 * @property {String} fips
 * @property {String} admin2
 * @property {String} provinceState
 * @property {String} countryRegion
 * @property {String} lastUpdate
 * @property {String} lat
 * @property {String} long
 * @property {String} confirmed
 * @property {String} deaths
 * @property {String} recovered
 * @property {String} active
 * @property {String} combinedKey
 * @property {String} incidentRate
 * @property {String} caseFatalityRatio
 */

/**
 * @typedef {Object} CovidCountry
 * @property {String} name
 * @property {String} [iso2]
 * @property {String} [iso3]
 */

/**
 * @typedef {Object} CovidConfirmed
 * @property {?String} provinceState
 * @property {String} countryRegion
 * @property {Number} lastUpdate
 * @property {?Number} lat
 * @property {?Number} long
 * @property {Number} confirmed
 * @property {Number} deaths
 * @property {?Number} recovered
 * @property {?Number} active
 * @property {?String} admin2
 * @property {?String} fips
 * @property {String} combinedKey
 * @property {?Number} incidentRate
 * @property {?Number} peopleTested
 * @property {?Number} peopleHospitalized
 * @property {Number} uid
 * @property {?String} iso3
 * @property {?Number} cases28Days
 * @property {?Number} deaths28Days
 * @property {String} [iso2]
 */

/**
 * @typedef {{
 *  name: String,
 *  max_rarity: Number,
 *  ['1-piece_bonus']?: String
 *  ['2-piece_bonus']?: String
 *  ['3-piece_bonus']?: String
 *  ['4-piece_bonus']?: String
 *  ['5-piece_bonus']?: String
 * }} GenshinArtifact
 */

/**
 * @typedef {Object} GenshinCharacter
 * @property {String} name
 * @property {String} title
 * @property {String} vision
 * @property {String} weapon
 * @property {String} [gender]
 * @property {String} [specialDish]
 * @property {String} nation
 * @property {String} affiliation
 * @property {Number} rarity
 * @property {String} constellation
 * @property {String} [birthday]
 * @property {String} description
 * @property {GenshinCharacterSkillTalent[]} skillTalents
 * @property {GenshinCharacterPassiveTalent[]} passiveTalents
 * @property {GenshinCharacterConstellation[]} constellations
 * @property {String} vision_key
 * @property {String} weapon_type
 * @property {GenshinCharacterOutfit[]} [outfits]
 */

/**
 * @typedef {Object} GenshinCharacterSkillTalent
 * @property {String} name
 * @property {String} unlock
 * @property {String} description
 * @property {GenshinCharacterSkillTalentUpgrade[]} [upgrades]
 * @property {String} [type]
 */

/**
 * @typedef {Object} GenshinCharacterSkillTalentUpgrade
 * @property {String} name
 * @property {String} value
 */

/**
 * @typedef {Object} GenshinCharacterPassiveTalent
 * @property {String} name
 * @property {String} unlock
 * @property {String} description
 * @property {Number} [level]
 */

/**
 * @typedef {Object} GenshinCharacterConstellation
 * @property {String} name
 * @property {String} unlock
 * @property {String} description
 * @property {Number} level
 */

/**
 * @typedef {Object} GenshinCharacterOutfit
 * @property {String} type
 * @property {String} name
 * @property {String} description
 * @property {Number} rarity
 * @property {Number} price
 * @property {String} image
 */

/**
 * @typedef {Object} GenshinWeapon
 * @property {String} name
 * @property {String} type
 * @property {Number} rarity
 * @property {Number} baseAttack
 * @property {String} subStat
 * @property {String} passiveName
 * @property {String} [passiveDesc]
 * @property {String} location
 * @property {String} ascensionMaterial
 */

/**
 * @typedef {Object} GithubUser
 * @property {String} login
 * @property {Number} id
 * @property {String} node_id
 * @property {String} avatar_url
 * @property {?String} gravatar_id
 * @property {String} url
 * @property {String} html_url
 * @property {String} followers_url
 * @property {String} following_url
 * @property {String} gists_url
 * @property {String} starred_url
 * @property {String} subscriptions_url
 * @property {String} organizations_url
 * @property {String} repos_url
 * @property {String} events_url
 * @property {String} received_events_url
 * @property {String} type
 * @property {Boolean} site_admin
 * @property {?String} name
 * @property {?String} company
 * @property {?String} blog
 * @property {?String} location
 * @property {?String} email
 * @property {?Boolean} hireable
 * @property {?String} bio
 * @property {?String} twitter_username
 * @property {Number} public_repos
 * @property {Number} public_gists
 * @property {Number} followers
 * @property {Number} following
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * @typedef {Object} GithubRepository
 * @property {Number} id
 * @property {String} node_id
 * @property {?String} name
 * @property {?String} full_name
 * @property {Boolean} private
 * @property {?GithubRepositoryOwner} owner
 * @property {String} html_url
 * @property {?String} description
 * @property {Boolean} fork
 * @property {String} url
 * @property {String} forks_url
 * @property {String} keys_url
 * @property {String} collaborators_url
 * @property {String} teams_url
 * @property {String} books_url
 * @property {String} issue_events_url
 * @property {String} events_url
 * @property {String} assignees_url
 * @property {String} branches_url
 * @property {String} tags_url
 * @property {String} blobs_url
 * @property {String} git_tags_url
 * @property {String} git_refs_url
 * @property {String} trees_url
 * @property {String} statuses_url
 * @property {String} languages_url
 * @property {String} stargazers_url
 * @property {String} contributors_url
 * @property {String} subscribers_url
 * @property {String} subscription_url
 * @property {String} commits_url
 * @property {String} git_commits_url
 * @property {String} comments_url
 * @property {String} isseu_comment_url
 * @property {String} contents_url
 * @property {String} compare_url
 * @property {String} merges_url
 * @property {String} archive_url
 * @property {String} downloads_url
 * @property {String} issues_url
 * @property {String} pulls_url
 * @property {String} milestones_url
 * @property {String} notifications_url
 * @property {String} labels_url
 * @property {String} releases_url
 * @property {String} deployments_url
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {Date} pushed_at
 * @property {String} git_url
 * @property {String} ssh_url
 * @property {String} clone_url
 * @property {String} svn_url
 * @property {?String} homepage
 * @property {Number} size
 * @property {Number} stargazers_count
 * @property {Number} watchers_count
 * @property {?String} language
 * @property {Boolean} has_issues
 * @property {Boolean} has_projects
 * @property {Boolean} has_downloads
 * @property {Boolean} has_wiki
 * @property {Boolean} has_pages
 * @property {Boolean} has_discussions
 * @property {Number} forks_count
 * @property {?String} mirror_url
 * @property {Boolean} archived
 * @property {Boolean} disabled
 * @property {Number} open_issues_count
 * @property {?GithubLicense} license
 * @property {Boolean} allow_forking
 * @property {Boolean} is_template
 * @property {Boolean} web_commit_signoff_required
 * @property {String[]} topics
 * @property {String} visibility
 * @property {Number} forks
 * @property {Number} open_issues
 * @property {Number} watchers
 * @property {String} default_branch
 * @property {Number} score
 */

/**
 * @typedef {Object} GithubRepositoryOwner
 * @property {String} login
 * @property {Number} id
 * @property {String} node_id
 * @property {?String} avatar_url
 * @property {?String} gravatar_id
 * @property {String} url
 * @property {String} html_url
 * @property {String} followers_url
 * @property {String} following_url
 * @property {String} gists_url
 * @property {String} starred_url
 * @property {String} subscriptions_url
 * @property {String} organizations_url
 * @property {String} repos_url
 * @property {String} events_url
 * @property {String} received_events_url
 * @property {String} type
 * @property {Boolean} site_admin
 */

/**
 * @typedef {Object} GithubLicense
 * @property {String} key
 * @property {String} name
 * @property {?String} spdx_id
 * @property {?String} url
 * @property {String} node_id
 */

/**
 * @typedef {Object} ExtraMinecraftData
 * @property {{ [name: String]: ExtraBlock }} block
 * @property {{ [name: String]: ExtraBiome }} biome
 * @property {{ [name: String]: ExtraEffect }} effect
 * @property {{ [name: String]: ExtraEnchantment }} enchantment
 * @property {{ [name: String]: ExtraEntity }} entity
 * @property {{ [name: String]: ExtraFood }} food
 */

/**
 * @typedef {Object} ExtraBlock
 * @property {String} [version]
 * @property {String[]} [positions]
 * @property {String} [altName]
 * @property {String} [description]
 * @property {Boolean} [animated]
 * @property {Boolean} [renewable]
 * @property {Boolean} flammable
 * @property {Boolean} luminant
 */

/**
 * @typedef {Object} ExtraBiome
 * @property {String} [version]
 * @property {String[]} [blocks]
 * @property {String[]} [structures]
 * @property {String} [altName]
 * @property {String} description
 * @property {{ [name: String]: String }} [colors]
 */

/**
 * @typedef {Object} ExtraEffect
 * @property {String} [version]
 * @property {String[]} [positions]
 * @property {String} [altName]
 * @property {String} description
 * @property {String} [particle]
 */

/**
 * @typedef {Object} ExtraEnchantment
 * @property {String} description
 */

/**
 * @typedef {Object} ExtraEntity
 * @property {String} [version]
 * @property {String[]} [positions]
 * @property {String} [altName]
 * @property {String} description
 * @property {Boolean} [animated]
 * @property {Number} [hp]
 * @property {String[]} [spawns]
 * @property {String[]} [usableItems]
 * @property {Number} [stackSize]
 * @property {Boolean} [renewable]
 * @property {Boolean} [flammable]
 */

/**
 * @typedef {Object} ExtraFood
 * @property {String} [version]
 * @property {String[]} [positions]
 * @property {String} [altName]
 * @property {String} description
 * @property {Boolean} [animated]
 * @property {Boolean} [renewable]
 */

/**
 * @typedef {{ [name: String]: VtuberAffiliationData }} VtuberAffiliation
 */

/**
 * @typedef {Object} VtuberAffiliationData
 * @property {String} name
 * @property {String} [logoURL]
 */

/**
 * @typedef {Object} NPMPackage
 * @property {String} _id
 * @property {String} _rev
 * @property {String} name
 * @property {NPMPackageTime} time
 * @property {NPMPackageUser[]} [maintainers]
 * @property {NPMPackageUser} [author]
 * @property {{ [name: String]: String }} [dist-tags]
 * @property {String} description
 * @property {String} readme
 * @property {{ [name: String]: NPMPackageVersion }} versions
 * @property {String} homepage
 * @property {String[]} [keywords]
 * @property {NPMPackageRepository} repository
 * @property {NPMPackageBug} bugs
 * @property {?String} license
 * @property {String} readmeFilename
 * @property {{ [name: String]: Boolean }} users
 * @property {String[] | NPMPackageUser[]} contributors
 */

/**
 * @typedef {{ [name: String]: Date, modified: Date, created: Date }} NPMPackageTime
 */

/**
 * @typedef {Object} NPMPackageUser
 * @property {String} name
 * @property {String} [email]
 * @property {String} [url]
 */

/**
 * @typedef {Object} NPMPackageVersion
 * @property {String} name
 * @property {String} version
 * @property {String} description
 * @property {String} main
 * @property {String} [module]
 * @property {String} [types]
 * @property {{ [name: String]: String }} [bin]
 * @property {{ [name: String]: String }} [exports]
 * @property {NPMPackageVersionNYC} [nyc]
 * @property {{ [name: String]: String }} scripts
 * @property {NPMPackageRepository} repository
 * @property {String[]} keywords
 * @property {NPMPackageUser} author
 * @property {String[]} [contributors]
 * @property {String} [license]
 * @property {NPMPackageLicense[]} [licenses]
 * @property {NPMPackageBug} bugs
 * @property {String} homepage
 * @property {{ [name: String]: String }} [dependencies]
 * @property {{ [name: String]: String }} [devDependencies]
 * @property {{ [name: String]: String }} [engines]
 * @property {String} readme
 * @property {String} readmeFilename
 * @property {String} [stableVersion]
 * @property {NPMPackageVersionJSONOption} [_npmJsonOpts]
 * @property {String} [ender]
 * @property {String} [dojoBuild]
 * @property {String} [typings]
 * @property {{ [name: String]: { [name: String]: String[] } }} [typesVersions]
 * @property {NPMPackageVersionJSPM} [jspm]
 * @property {NPMPackageVersionSPM} [spm]
 * @property {String} [dojoBuild]
 * @property {String} gitHead
 * @property {String} _id
 * @property {String} [_shasum]
 * @property {String} [from]
 * @property {Boolean} [_engineSupported]
 * @property {String} _npmVersion
 * @property {String} _nodeVersion
 * @property {Boolean} [_defaultsLoaded]
 * @property {NPMPackageUser} _npmUser
 * @property {NPMPackageDist} dist
 * @property {NPMPackageUser[]} maintainers
 * @property {{ [name: String]: String }} [directories]
 * @property {NPMPackageVersionOperationalInternal} [_npmOperationalInternal]
 * @property {Boolean} [_hasShrinkwrap]
 * @property {String} deprecated
 */

/**
 * @typedef {Object} NPMPackageRepository
 * @property {String} type
 * @property {String} [url]
 */

/**
 * @typedef {Object} NPMPackageLicense
 * @property {String} type
 */

/**
 * @typedef {Object} NPMPackageBug
 * @property {String} url
 */

/**
 * @typedef {Object} NPMPackageVersionNYC
 * @property {String[]} exclude
 */

/**
 * @typedef {Object} NPMPackageVersionJSONOption
 * @property {String} file
 * @property {Boolean} wscript
 * @property {Boolean} contributors
 * @property {Boolean} serverjs
 */

/**
 * @typedef {Object} NPMPackageVersionJSPM
 * @property {String[]} files
 * @property {{ [name: String]: String }} map
 * @property {{ [name: String]: any }} buildConfig
 */

/**
 * @typedef {Object} NPMPackageVersionSPM
 * @property {String} main
 * @property {String[]} output
 */

/**
 * @typedef {Object} NPMPackageVersionOperationalInternal
 * @property {String} host
 * @property {String} tmp
 */

/**
 * @typedef {Object} NPMPackageDist
 * @property {String} shasum
 * @property {String} tarball
 * @property {String} integrity
 * @property {Number} [fileCount]
 * @property {Number} [unpackedSize]
 * @property {String} [npm-signature]
 * @property {NPMPackageDistSignature[]} signatures
 */

/**
 * @typedef {Object} NPMPackageDistSignature
 * @property {String} keyid
 * @property {String} sig
 */

/**
 * @typedef {Object} Weather
 * @property {WeatherLocation} location
 * @property {WeatherCurrent} current
 * @property {WeatherForecast[]} forecast
 */

/**
 * @typedef {Object} WeatherLocation
 * @property {String} name
 * @property {String} [zipcode]
 * @property {String} [lat]
 * @property {String} [long]
 * @property {String} timezone
 * @property {String} alert
 * @property {String} degreetype
 * @property {String} imagerelativeurl
 */

/**
 * @typedef {Object} WeatherCurrent
 * @property {String} temperature
 * @property {String} skycode
 * @property {String} skytext
 * @property {String} date
 * @property {String} observationtime
 * @property {String} observationPoint
 * @property {String} feelslike
 * @property {String} humidity
 * @property {String} winddisplay
 * @property {String} day
 * @property {String} shortday
 * @property {String} windspeed
 * @property {String} imageUrl
 */

/**
 * @typedef {Object} WeatherForecast
 * @property {String} low
 * @property {String} high
 * @property {String} skycodeday
 * @property {String} skytextday
 * @property {String} date
 * @property {String} day
 * @property {String} shortday
 * @property {String} precip
 */

/**
 * @typedef {Object} AnimeInfo
 * @property {String} mal_id
 * @property {String} url
 * @property {{ jpg: AnimeImage, webp: AnimeImage }} images
 * @property {AnimeTrailer} trailer
 * @property {Boolean} approved
 * @property {AnimeTitle[]} titles
 * @property {String} title
 * @property {?String} title_english
 * @property {String} title_japanese
 * @property {String[]} title_synonyms
 * @property {?String} type
 * @property {String} source
 * @property {?Number} episodes
 * @property {String} status
 * @property {Boolean} airing
 * @property {AnimeAired} aired
 * @property {String} duration
 * @property {?String} rating
 * @property {?Number} score
 * @property {?Number} scored_by
 * @property {?Number} rank
 * @property {?Number} popularity
 * @property {?Number} members
 * @property {?Number} favorites
 * @property {?String} synopsis
 * @property {?String} background
 * @property {?String} season
 * @property {?Number} year
 * @property {?AnimeBroadcast} broadcast
 * @property {AnimeProducer[]} producers
 * @property {AnimeLicensor[]} licensors
 * @property {AnimeStudio[]} studios
 * @property {AnimeGenre[]} genres
 * @property {AnimeGenre[]} explicit_genres
 * @property {AnimeGenre[]} themes
 * @property {AnimeGenre[]} demographics
 */

/**
 * @typedef {Object} AnimeImage
 * @property {?String} image_url
 * @property {?String} [small_image_url]
 * @property {?String} [medium_image_url]
 * @property {?String} [large_image_url]
 * @property {?String} [maximum_image_url]
 */

/**
 * @typedef {Object} AnimeTrailer
 * @property {?String} youtube_id
 * @property {?String} url
 * @property {?String} embed_url
 * @property {AnimeImage} images
 */

/**
 * @typedef {Object} AnimeTitle
 * @property {String} type
 * @property {String} title
 */

/**
 * @typedef {Object} AnimeAired
 * @property {?String} from
 * @property {?String} to
 * @property {{ from: AnimeAiredProperty, to: AnimeAiredProperty }} prop
 * @property {?String} string
 */

/**
 * @typedef {Object} AnimeAiredProperty
 * @property {?Number} day
 * @property {?Number} month
 * @property {?Number} year
 */

/**
 * @typedef {Object} AnimeBroadcast
 * @property {?Number} day
 * @property {?Number} time
 * @property {?Number} timezone
 * @property {?String} string
 */

/**
 * @typedef {Object} AnimeProducer
 * @property {Number} mal_id
 * @property {String} type
 * @property {String} name
 * @property {String} url
 */

/**
 * @typedef {Object} AnimeLicensor
 * @property {Number} mal_id
 * @property {String} type
 * @property {String} name
 * @property {String} url
 */

/**
 * @typedef {Object} AnimeStudio
 * @property {Number} mal_id
 * @property {String} type
 * @property {String} name
 * @property {String} url
 */

/**
 * @typedef {Object} AnimeGenre
 * @property {Number} mal_id
 * @property {String} type
 * @property {String} name
 * @property {String} url
 */

/**
 * @typedef {Object} AnimeCharacter
 * @property {String} mal_id
 * @property {String} url
 * @property {{ jpg: AnimeImage, webp: AnimeImage }} images
 * @property {String} name
 * @property {String} name_kanji
 * @property {String[]} nicknames
 * @property {Number} favorites
 * @property {?String} about
 */

/**
 * @typedef {Object} News
 * @property {NewsSource} source
 * @property {?String} author
 * @property {String} title
 * @property {?String} description
 * @property {String} url
 * @property {String} urlToImage
 * @property {Date} publishedAt
 * @property {?String} content
 */

/**
 * @typedef {Object} NewsSource
 * @property {?String} id
 * @property {String} name
 */

/**
 * @typedef {Object} MangaInfo
 * @property {String} mal_id
 * @property {String} url
 * @property {{ jpg: MangaImage, webp: MangaImage }} images
 * @property {Boolean} approved
 * @property {MangaTitle[]} titles
 * @property {String} title
 * @property {?String} title_english
 * @property {String} title_japanese
 * @property {String[]} title_synonyms
 * @property {?String} type
 * @property {?Number} chapters
 * @property {?Number} volumes
 * @property {String} status
 * @property {Boolean} publishing
 * @property {MangaPublished} published
 * @property {String} duration
 * @property {?String} rating
 * @property {?Number} score
 * @property {?Number} scored
 * @property {?Number} scored_by
 * @property {?Number} rank
 * @property {?Number} popularity
 * @property {?Number} members
 * @property {?Number} favorites
 * @property {?String} synopsis
 * @property {?String} background
 * @property {MangaAuthor[]} authors
 * @property {MangaSerialization[]} serializations
 * @property {MangaGenre[]} genres
 * @property {MangaGenre[]} explicit_genres
 * @property {MangaGenre[]} themes
 * @property {MangaGenre[]} demographics
 */

/**
 * @typedef {Object} MangaImage
 * @property {?String} image_url
 * @property {?String} [small_image_url]
 * @property {?String} [medium_image_url]
 * @property {?String} [large_image_url]
 * @property {?String} [maximum_image_url]
 */

/**
 * @typedef {Object} MangaTitle
 * @property {String} type
 * @property {String} title
 */

/**
 * @typedef {Object} MangaPublished
 * @property {?String} from
 * @property {?String} to
 * @property {{ from: MangaPublishedProperty, to: MangaPublishedProperty }} prop
 * @property {?String} string
 */

/**
 * @typedef {Object} MangaPublishedProperty
 * @property {?Number} day
 * @property {?Number} month
 * @property {?Number} year
 */

/**
 * @typedef {Object} MangaAuthor
 * @property {Number} mal_id
 * @property {String} type
 * @property {String} name
 * @property {String} url
 */

/**
 * @typedef {Object} MangaSerialization
 * @property {Number} mal_id
 * @property {String} type
 * @property {String} name
 * @property {String} url
 */

/**
 * @typedef {Object} MangaGenre
 * @property {Number} mal_id
 * @property {String} type
 * @property {String} name
 * @property {String} url
 */

/**
 * @typedef {Object} UrbanDictionary
 * @property {String} definition
 * @property {String} permalink
 * @property {Number} thumbs_up
 * @property {String[]} sound_urls
 * @property {String} author
 * @property {String} word
 * @property {Number} defid
 * @property {String} current_vote
 * @property {Date} written_on
 * @property {String} example
 * @property {Number} thumbs_down
 */

/**
 * @typedef {Object} MDNDocument
 * @property {String} mdn_url
 * @property {Number} score
 * @property {String} title
 * @property {String} locale
 * @property {String} slug
 * @property {Number} popularity
 * @property {String} summary
 * @property {MDNHighlight} highlight
 * @property {Date} written_on
 * @property {String} example
 * @property {Number} thumbs_down
 */

/**
 * @typedef {Object} MDNSuggestion
 * @property {String} text
 * @property {{ value: Number, relation: String }} total
 */

/**
 * @typedef {Object} MDNHighlight
 * @property {String[]} body
 * @property {String[]} title
 */

/**
 * @typedef {Object} GogoAnimeSearch
 * @property {String} title
 * @property {String} img
 * @property {String} link
 * @property {String} releaseDate
 */

/**
 * @typedef {Object} GogoAnimeFetch
 * @property {String} name
 * @property {String} image
 * @property {String} episodeCount
 * @property {String} slug
 * @property {String} type
 * @property {String} plot_summary
 * @property {String} genre
 * @property {String} released
 * @property {String} status
 * @property {String} other_name
 */

/**
 * @typedef {Object} GogoAnimeEpisode
 * @property {String} name
 * @property {String} episodeCount
 * @property {String} id
 */

/**
 * @typedef {Object} NHentai
 * @property {String} title_romaji
 * @property {String} title_native
 * @property {String} read
 * @property {String[]} tags
 * @property {String[]} image
 */

/**
 * @typedef {Object} NHentaiSearch
 * @property {Number} id
 * @property {String} title_native
 * @property {String} title_english
 * @property {String} title_japanese
 * @property {String} title_native
 * @property {Number} page
 */

/**
 * @typedef {Object} Otakudesu
 * @property {String} title
 * @property {OtakudesuProvider[]} link_dl
 */

/**
 * @typedef {Object} OtakudesuProvider
 * @property {String} reso
 * @property {String} size
 * @property {{ [name: String]: String }} link_dl
 */

/**
 * @typedef {Object} Kusonime
 * @property {String} title
 * @property {String} thumbnail
 * @property {String} japanese
 * @property {String} genre
 * @property {String} seasons
 * @property {String} producers
 * @property {String} type
 * @property {String} status
 * @property {String} total_episode
 * @property {String} score
 * @property {String} duration
 * @property {String} released_on
 * @property {{ [name: String]: { [name: String]: String } }} link_dl
 */

/**
 * @typedef {Object} Instagram
 * @property {InstagramAccount} account
 * @property {String} caption
 * @property {String[]} media
 */

/**
 * @typedef {Object} InstagramAccount
 * @property {String} username
 * @property {String} full_name
 */

/**
 * @typedef {Object} Spotify
 * @property {String} id
 * @property {String} title
 * @property {String} artists
 * @property {Number} duration
 * @property {Number} popularity
 * @property {{ spotify: String }} external_urls
 * @property {String} preview_url
 * @property {String} thumbnail
 * @property {String} link
 */

/**
 * @typedef {Object} TikTok
 * @property {String} title
 * @property {String} keywords
 * @property {String} description
 * @property {String} thumbnail
 * @property {Number} duration
 * @property {TikTokAuthor} author
 * @property {TikTokStat} statistic
 * @property {String} link
 */

/**
 * @typedef {Object} TikTokAuthor
 * @property {String} username
 * @property {String} nickname
 * @property {String} avatar
 */

/**
 * @typedef {Object} TikTokStat
 * @property {Number} play_count
 * @property {Number} like_count
 * @property {Number} share_count
 * @property {Number} comment_count
 */

/**
 * @typedef {Object} TwitterImage
 * @property {TwitterUser} user
 * @property {String} title
 * @property {Date} publish
 * @property {String} link
 */

/**
 * @typedef {Object} TwitterUser
 * @property {String} name
 * @property {String} username
 * @property {String} photo
 */

/**
 * @typedef {Object} TwitterVideo
 * @property {TwitterUser} user
 * @property {String} title
 * @property {Date} publish
 * @property {String} thumbnail
 * @property {Number} duration
 * @property {TwitterVideoLink[]} link
 */

/**
 * @typedef {Object} TwitterVideoLink
 * @property {Number} bitrate
 * @property {String} url
 */

/**
 * @typedef {Object} YouTubeAudio
 * @property {String} title
 * @property {String} thumbnail
 * @property {String} size
 * @property {String} link
 */

/**
 * @typedef {Object} YouTubeVideo
 * @property {String} id
 * @property {String} title
 * @property {String} uploader
 * @property {String} channel
 * @property {String} duration
 * @property {Number} view
 * @property {Number} like
 * @property {Number} dislike
 * @property {String} thumbnail
 * @property {String} description
 * @property {YouTubeVideoLink} link
 */

/**
 * @typedef {Object} YouTubeVideoLink
 * @property {String} link
 * @property {String} type
 * @property {String} resolution
 * @property {String} size
 */

/**
 * @typedef {Object} YouTubeShorts
 * @property {String} title
 * @property {String} thumbnail
 * @property {String} size
 * @property {String} link
 */

/**
 * @typedef {Object} InstagramInfo
 * @property {String} photo_profile
 * @property {String} username
 * @property {String} fullname
 * @property {Number} posts
 * @property {Number} following
 * @property {Number} followers
 * @property {String} bio
 */

/**
 * @typedef {Object} Doujindesu
 * @property {String} title
 * @property {String} link
 * @property {String} thumbnail
 * @property {String} type
 */

/**
 * @typedef {Object} DoujindesuLatest
 * @property {String} title
 * @property {String} link
 * @property {String} thumbnail
 * @property {String} episode
 * @property {String} type
 */

/**
 * @typedef {Object} KBBI
 * @property {String} nama
 * @property {String} nomor
 * @property {String[]} kata_dasar
 * @property {String} pelafalan
 * @property {String[]} bentuk_tidak_baku
 * @property {String[]} varian
 * @property {KBBIMeaning[]} makna
 */

/**
 * @typedef {Object} KBBIMeaning
 * @property {KBBIPartOfSpeech[]} kelas
 * @property {String[]} submakna
 * @property {String} info
 * @property {String[]} contoh
 */

/**
 * @typedef {Object} KBBIPartOfSpeech
 * @property {String} kode
 * @property {String} nama
 * @property {String} deskripsi
 */

exports.unused = {};
