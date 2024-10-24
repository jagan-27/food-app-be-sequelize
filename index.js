const express = require('express')
const { Sequelize, DataTypes, where, Op, fn, col } = require('sequelize');
const cors = require('cors');
const initModels = require('./models/init-models');
const config = require('./config');


const app = express();
app.use(cors())
app.use(express.json())

const sequelize = new Sequelize(config.dbname, config.user, config.pass, config.autoOptions);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const models = initModels(sequelize);
db.User = models.user;
db.Hotel = models.hotel;
db.HotelSignatureDish = models.hotelSignatureDish;
db.HotelTiming = models.hotelTiming;
db.HotelVideo = models.hotelVideo;

app.post('/login', async (req, res) => {
    try {
        const { userMobileNumber } = req.body;
        const user = await db.User.findOne({ where: { userMobileNumber } });

        if (!user) {
            return res.status(204).json({ error: 'User not found' });
        } else {
            if (user?.dataValues?.isActive) {
                res.status(200).json({ success: true });
            } else {
                res.status(200).json({ success: false, error: 'Please check with admin' });
            }
        }
    } catch (error) {
        console.log(error, "error in login")
        res.status(500).json({ error: "error in login" });
    }
})

app.get('/count/:userMobileNumber?', async (req, res) => {
    try {
        const userMobileNumber = req.params.userMobileNumber;
        const currentDateOnly = new Date().toISOString().split('T')[0];
        const whereCondition = userMobileNumber ? { userMobileNumber } : {};

        const totalCount = await db.Hotel.count({ 
            where: {
                ...whereCondition,
                [Op.and]: [
                    {
                      created_date: {
                        [Op.gte]: `2024-10-13 00:00:00`,
                      }
                    },
                ]
            },
        });

        const totalCountVideo = await db.HotelVideo.count({ 
            where: {
                ...whereCondition,
                [Op.and]: [
                    {
                      created_date: {
                        [Op.gte]: `2024-10-13 00:00:00`,
                      }
                    },
                ]
            },
        });

        const dailyCount = await db.Hotel.count({ 
            where: {
                ...whereCondition,
                [Op.and]: [
                    {
                      created_date: {
                        [Op.gte]: `${currentDateOnly} 00:00:00`,  // Start of the day
                        [Op.lt]: `${currentDateOnly} 23:59:59`    // End of the day
                      }
                    },
                ]
            }
        });

        const dailyCountVideo = await db.HotelVideo.count({ 
            where: {
                ...whereCondition,
                [Op.and]: [
                    {
                      created_date: {
                        [Op.gte]: `${currentDateOnly} 00:00:00`,  // Start of the day
                        [Op.lt]: `${currentDateOnly} 23:59:59`    // End of the day
                      }
                    },
                ]
            }
        });

        const validCount = await db.Hotel.count({ 
            where: { 
                ...whereCondition,
                valid: true,
                [Op.and]: [
                    {
                      created_date: {
                        [Op.gte]: `2024-10-13 00:00:00`,
                      }
                    },
                ]
            } 
        });

        const validCountVideo = await db.HotelVideo.count({ 
            where: { 
                ...whereCondition,
                valid: true,
                [Op.and]: [
                    {
                      created_date: {
                        [Op.gte]: `2024-10-13 00:00:00`,
                      }
                    },
                ]
            } 
        });

        const inValidCount = await db.Hotel.count({ 
            where: { 
                ...whereCondition,
                valid: false,
                [Op.and]: [
                    {
                      created_date: {
                        [Op.gte]: `2024-10-13 00:00:00`,
                      }
                    },
                ]
            } 
        });

        const inValidCountVideo = await db.HotelVideo.count({ 
            where: { 
                ...whereCondition,
                valid: false,
                [Op.and]: [
                    {
                      created_date: {
                        [Op.gte]: `2024-10-13 00:00:00`,
                      }
                    },
                ]
            } 
        });
        
        res.status(200).json({ 
            allCount: totalCount + totalCountVideo, 
            verifiedCount: validCount + validCountVideo,
            dailyCount: dailyCount + dailyCountVideo,
            inValidCount: inValidCount + inValidCountVideo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

const incrementDate = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
};

app.get('/generateSheet', async (req, res) => {
    const { userMobileNumber, startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(200).json({ error: 'Both startDate and endDate are required' });
    }

    if (!userMobileNumber) {
        return res.status(200).json({ error: 'Mobile Number is required' });
    }

    try {
        let currentStartDate = new Date(startDate);
        const finalEndDate = new Date(endDate);
        finalEndDate.setDate(finalEndDate.getDate() + 1); 

        const whereCondition = { userMobileNumber };

        const results = [];

        while (currentStartDate < finalEndDate) {
            const currentEndDate = incrementDate(currentStartDate);

            console.log(`${currentStartDate.toISOString().split('T')[0]} 00:00:00`);
            console.log(`${currentEndDate.toISOString().split('T')[0]} 23:59:59`);
            
            const totalCount = await db.Hotel.count({ 
                where: {
                    ...whereCondition,
                    [Op.and]: [
                        {
                          created_date: {
                            [Op.gte]: `${currentStartDate.toISOString().split('T')[0]}`,
                            [Op.lt]: `${currentEndDate.toISOString().split('T')[0]}`,
                          }
                        },
                    ]
                },
            });

            const totalCountVideo = await db.HotelVideo.count({ 
                where: {
                    ...whereCondition,
                    [Op.and]: [
                        {
                          created_date: {
                            [Op.gte]: `${currentStartDate.toISOString().split('T')[0]}`,
                            [Op.lt]: `${currentEndDate.toISOString().split('T')[0]}`,
                          }
                        },
                    ]
                },
            });

            const validCount = await db.Hotel.count({ 
                where: { 
                    ...whereCondition,
                    valid: true,
                    [Op.and]: [
                        {
                            created_date: {
                                [Op.gte]: `${currentStartDate.toISOString().split('T')[0]}`,
                                [Op.lt]: `${currentEndDate.toISOString().split('T')[0]}`,
                            }
                        },
                    ]
                } 
            });
        
            const validCountVideo = await db.HotelVideo.count({ 
                where: { 
                    ...whereCondition,
                    valid: true,
                    [Op.and]: [
                        {
                            created_date: {
                                [Op.gte]: `${currentStartDate.toISOString().split('T')[0]}`,
                                [Op.lt]: `${currentEndDate.toISOString().split('T')[0]}`,
                            }
                        },
                    ]
                } 
            });

            const userDetails = await db.User.findOne({ 
                where: { 
                    ...whereCondition,
                } 
            });

            results.push({
                userMobileNumber,
                name: userDetails?.userName,
                date: currentStartDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                totalCount: totalCount+totalCountVideo,
                validCount: validCount+validCountVideo,
            });

            // Move to the next day
            currentStartDate = currentEndDate;
        }

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/searchhotels/:name?', async (req, res) => {
    const name = req.params?.name;

    if (!name || name.trim() === "") {
        return res.status(400).json({ error: 'Hotel name is required' });
    }

    try {
        // Find hotels by name using the `LIKE` operator for partial matches
        const hotels = await db.Hotel.findAll({
            where: {
                hotelName: {
                    [Op.iLike]: `%${name}%`  // Search for hotel name containing the search string
                }
            },
            attributes: {
                exclude: ['userMobileNumber', 'isActive']
            },
            include: [
                {
                    model: db.HotelSignatureDish,
                    as: 'hotelSignatureDishes'
                },
                {
                    model: db.HotelTiming,
                    as: 'hotelTimings'
                }
            ]
        });

        if (hotels.length === 0) {
            return res.status(200).json([]);
        }

        res.json(hotels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/verify', async (req, res) => {

    const { hotelId, verified, valid, hotelVideoData } = req?.body; // Get hotelId from the request parameters
    // const { verified, valid } = req.body; // Get verified and valid fields from the request body
    
    try {
        // Update the hotel record directly using the update method

        let updated;
        if (hotelVideoData) {
            [updated] = await db.HotelVideo.update(
                { verified, valid }, // Fields to update
                { where: { hotelId } } // Condition to find the correct hotel
            );
        } else {
            [updated] = await db.Hotel.update(
                { verified, valid }, // Fields to update
                { where: { hotelId } } // Condition to find the correct hotel
            );
        }
        
    
        if (updated) {
          // Fetch the updated hotel details
          const updatedHotel = await db.Hotel.findByPk(hotelId);
          res.status(200).json({
            message: 'Hotel status updated successfully',
            hotel: updatedHotel,
          });
        } else {
          res.status(204).json({ error: 'Hotel not found' });
        }
    } catch (error) {
        console.error('Error updating hotel status:', error);
        res.status(500).json({ error: 'An error occurred while updating hotel status' });
    }
  }
)

app.put('/updateHotel', async (req, res) => {
    const { hotelId } = req.body; // Get hotelId from the request parameters
    const fieldsToUpdate = req.body; // Get dynamic fields to update from the request body
  
    try {
      // Ensure there are fields to update
      if (!Object.keys(fieldsToUpdate).length) {
        return res.status(400).json({ error: 'No fields provided to update' });
      }
  
      // Update the hotel record dynamically using the update method
      const [updated] = await db.Hotel.update(
        fieldsToUpdate, // Fields to update dynamically
        { where: { hotelId } } // Condition to find the correct hotel
      );
  
      if (updated) {
        // Fetch the updated hotel details
        const updatedHotel = await db.Hotel.findByPk(hotelId);
        res.status(200).json({
          message: 'Hotel status updated successfully',
          hotel: updatedHotel,
        });
      } else {
        res.status(204).json({ error: 'Hotel not found' });
      }
    } catch (error) {
      console.error('Error updating hotel status:', error);
      res.status(500).json({ error: 'An error occurred while updating hotel status' });
    }
  }
)

app.get('/gethotels', async (req, res) => {
    const { userMobileNumber, createdDate, verified } = req.query;

    // Initialize whereCondition
    const whereCondition = {
        ...(verified ? {} : { verified: false }),
    };

    // Add userMobileNumber filter if provided
    if (userMobileNumber) {
        whereCondition.userMobileNumber = userMobileNumber;
    }

    // Add createdDate filter if provided and parse the date
    if (createdDate) {
        const startDate = new Date(createdDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        whereCondition.createdDate = {
            [Op.gte]: startDate,
            [Op.lt]: endDate
        };
    }

    try {
        let hotels = await db.Hotel.findAll({
            where: { ...whereCondition },
            include: [
                {
                    model: db.HotelSignatureDish,
                    as: 'hotelSignatureDishes'
                },
                {
                    model: db.HotelTiming,
                    as: 'hotelTimings'
                }
            ]
        });

        let hotelVideos = await db.HotelVideo.findAll({
            where: { ...whereCondition },
            include: [
                {
                    model: db.Hotel,
                    as: 'hotel',
                    attributes: [
                        'hotelId', 
                        'hotelName', 
                        'hotelAddress', 
                        'hotelCity', 
                        'hotelMapLocationLink',
                        'hotelPhone',
                        'hotelRating',
                        'hotelCategory'
                    ]
                }
            ]
        });

        hotelVideos = hotelVideos.map(hotelVideo => {
            return {
                ...hotelVideo.get({ plain: true }),
                duplicateVideoData: true
            };
        });
  
        const combinedData = [
            ...hotels,
            ...hotelVideos
        ];
  
        res.status(200).json(combinedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/gethotelsDetails/:hotelId?', async (req, res) => {
    const hotelId = req.params.hotelId;

    try {
        const hotels = await db.Hotel.findAll({
            where: { hotelId: hotelId },
            include: [
                {
                    model: db.HotelSignatureDish,
                    as: 'hotelSignatureDishes'
                },
                {
                    model: db.HotelTiming,
                    as: 'hotelTimings'
                }
            ]
        });
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/getVerifiedHotels/:showLatitude?', async (req, res) => {
    const showLatitude = req.params.showLatitude;
    let whereCondition = { verified: true };

    if (showLatitude) {
        whereCondition.latitude = { [db.Sequelize.Op.ne]: null };
    } else {
        whereCondition.latitude = null;
        whereCondition.longitude = null;
    }
    try {
        const hotels = await db.Hotel.findAll({
            where: whereCondition,
            include: [
                {
                    model: db.HotelSignatureDish,
                    as: 'hotelSignatureDishes'
                },
                {
                    model: db.HotelTiming,
                    as: 'hotelTimings'
                }
            ],
            limit: 150
        });
        
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Function to extract the video ID
const extractVideoId = (url) => {
    if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
        return url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtube.com/shorts/')) {
        return url.split('shorts/')[1].split('?')[0];
    } else if (url.includes('instagram.com/reel/')) {
        return url.split('reel/')[1].split('/')[0];
    } else if (url.includes('facebook.com/watch?v=')) {
        return url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('facebook.com/reel/')) {
        return url.split('reel/')[1].split('/')[0];
    } else if (url.includes('facebook.com/share/')) {
        return url.split('share/')[1];
    }
    return null;
};

 // Function to extract the video Type
 const extractVideoType = (url) => {
    if (url.includes('youtu.be/') || url.includes('youtube.com/watch?v=') || url.includes('youtube.com/shorts/')) {
        return 'Youtube';
    } else if (url.includes('instagram.com/reel/')) {
        return 'Instagram';
    } else if (url.includes('facebook.com/watch?v=') || url.includes('facebook.com/reel/') || url.includes('facebook.com/share/')) {
        return 'Facebook';
    }
    return null;
};

app.post('/createhotel', async (req, res) => {
    try {
        const hotel = req.body;

        // Extract video ID from the hotelVlogVideoLink
        const videoId = extractVideoId(hotel.hotelVlogVideoLink);
        const videoType = extractVideoType(hotel.hotelVlogVideoLink);

        if (!videoId) {
            return res.status(400).json({ error: "Invalid video link" });
        }

        // Check if a hotel with the extracted videoId already exists
        const existingHotel = await db.Hotel.findOne({ where: { video_id: videoId } });

        if (existingHotel) {
            return res.status(208).json({ success: false, message: "Hotel with this video already exists" });
        }

        if (videoType === 'Youtube') {  
            return res.status(208).json({ success: false, message: "Youtube entry is temporarily stopped" });
        }

        // If no existing hotel, create the new one
        const [result, created] = await db.Hotel.findOrCreate({
            where: { hotelVlogVideoLink: hotel.hotelVlogVideoLink }, defaults: {
                userMobileNumber: hotel.userMobileNumber,
                hotelName: hotel.hotelName,
                hotelAddress: hotel.hotelAddress,
                hotelCity: hotel.hotelCity,
                hotelRating: hotel.hotelRating,
                hotelPhone: hotel.hotelPhone,
                hotelMapLocationLink: hotel.hotelMapLocationLink,
                vlogVideoViewCount: hotel.vlogVideoViewCount,
                vlogPostDate: hotel.vlogPostDate,
                hotelVlogVideoLink: hotel.hotelVlogVideoLink,
                videoId: videoId,
                videoType: videoType,
                hotelCategory: hotel.hotelCategory
            }
        });
        if (created) {
            return res.status(201).json(result);
        }
        return res.status(208).json({ success: false, message: "Data Already exists" });
    } catch (error) {
        console.log(error, "error in createhotel")
        res.status(500).json({ error: "error in createhotel" });
    }
})

app.post('/hotel/:id', async (req, res) => {
    try {
        const hotelId = req.params.id;
        const [updated] = await db.Hotel.update(req.body, {
            where: { hotelId }
        });
        if (updated) {
            const updatedHotel = await db.Hotel.findByPk(hotelId);
            res.json(updatedHotel);
        } else {
            res.status(204).json({ error: 'Hotel not found' });
        }
    } catch (error) {
        console.error('Error updating hotel:', error);
        res.status(500).json({ error: 'Error updating hotel' });
    }
});


app.post('/dish', async (req, res) => {
    try {
        const newDish = await db.HotelSignatureDish.create(req.body);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/timing', async (req, res) => {
    try {
        const newTiming = await db.HotelTiming.create(req.body);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/createhotelvideo', async (req, res) => {
    try {
        const video = req.body;

        // Extract video ID from the hotelVlogVideoLink
        const videoId = extractVideoId(video.hotelVlogVideoLink);
        const videoType = extractVideoType(video.hotelVlogVideoLink);
        
        const [result, created] = await db.HotelVideo.findOrCreate({
            where: { hotelVlogVideoLink: video.hotelVlogVideoLink }, defaults: {
                hotelVlogVideoLink: video.hotelVlogVideoLink,
                vlogVideoViewCount: video.vlogVideoViewCount,
                vlogPostDate: video.vlogPostDate,
                videotype: videoType,
                videoid: videoId,
                hotelId: video.hotelId,
                verified: video.verified,
                userMobileNumber: video.userMobileNumber
            }
        });
        if (created) {
            return res.status(201).json(result);
        }
        return res.status(208).json({ success: false, message: 'Data is already exists' });
    } catch (error) {
        console.log(error, "error in createhotelvideo");
        res.status(500).json({ error: "Error creating hotel video" });
    }
});

// DELETE API to delete a hotel by hotelId
app.get('/deletehotel/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    
    try {
        await db.HotelTiming.destroy({
            where: {
              hotelId: hotelId
            }
        });

        await db.HotelSignatureDish.destroy({
            where: {
              hotelId: hotelId
            }
        });

      // Find and delete the hotel record
      const deletedHotel = await db.Hotel.destroy({
        where: {
            hotelId: hotelId
        }
      });

      // If no record found, send a 404 error
      if (!deletedHotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
  
      // On successful deletion
      return res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
      // Handle errors
      console.error(error);
      return res.status(500).json({ message: 'Error deleting hotel', error: error.message });
    }
  });

app.listen(3001, () => {
    console.log('listening 3001 port')
    db.sequelize.sync({ force: false }).then(() => {
        console.log('Database synchronized');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
})
