import { supabase } from "../supabase";

// GET CAMPAIGNS
export const getCampaigns = async () => {

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("id", { ascending:false });

  if(error){

    console.log(error);

    return [];

  }

  return data || [];

};

// =========================
// USERS
// =========================

// ✅ CURRENT USER FROM SUPABASE
export const getUser = async () => {

  const {
    data:{ user }
  } = await supabase.auth.getUser();

  if(!user) return null;

  const { data, error } =
    await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

  if(error) return null;

  return data;

};

export const getAllUsers = async () => {

  const { data, error } =
    await supabase
      .from("users")
      .select("*");

  if(error) return [];

  return data;

};

// 🔥 UPDATE USER EVERYWHERE (MOST IMPORTANT)
export const updateUserEverywhere =
async (updatedUser) => {

  const cleanUser = {

    name: updatedUser.name,

    email: updatedUser.email,

    pyebalance:
      Number(
        Number(updatedUser.pyebalance || 0)
          .toFixed(2)
      ),

    balance:
      Number(
        Number(updatedUser.balance || 0)
          .toFixed(2)
      ),

    units:
      Number(updatedUser.units || 0),

    blocked:
      updatedUser.blocked || false,

    active:
      updatedUser.active || false,

    referrals:
      updatedUser.referrals || [],

    // ✅ REFERRAL ENGINE
    referralCommission:
      Number(updatedUser.referralCommission || 0),

    totalReferralCommission:
      Number(updatedUser.totalReferralCommission || 0),

    levelAReferrals:
      updatedUser.levelAReferrals || [],

    levelBReferrals:
      updatedUser.levelBReferrals || [],

    levelCReferrals:
      updatedUser.levelCReferrals || [],

    referral_code:
      updatedUser.referral_code || "",

    referred_by:
      updatedUser.referred_by || null

  };

  const { error, data } =
    await supabase
      .from("users")
      .update(cleanUser)
      .eq("id", updatedUser.id)
      .select();

  if(error){

    console.log(
      "UPDATE USER ERROR:",
      error
    );

    return false;
  }

  console.log(
    "UPDATED USER:",
    data
  );

  return true;

};

// 🔥 SETUSER
export const setUser = async (user) => {

  const { error } =
    await supabase
      .from("users")
      .update(user)
      .eq("id", user.id);

  return !error;

};

// =========================
// REFERRALS
// =========================

export const addReferral = async (newUserId) => {
  const user = await getUser();
  if (!user) return;

  user.referrals = user.referrals || [];

  user.referrals.push({
    id: newUserId,
    hasPurchased: false
  });

  await updateUserEverywhere(user);
};

// =========================
// AUTH
// =========================

export const logoutUser = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("user");
};

// =========================
// TRANSACTIONS (SUPABASE)
// =========================

export const getTransactions = async () => {

  const { data, error } =
    await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending:false });

  if(error){
    console.log(error);
    return [];
  }

  return data;

};

export const addTransaction = async (tx) => {

  console.log("ADDING TX:", tx);

  const user = await getUser();

  if(!user && !tx.user_id) return false;

  const payload = {

    user_id:
      tx.user_id || user.id,

    type:
      tx.type || "",

    amount:
      Number(tx.amount || 0),

    name:
      tx.name || "",

    status:
      tx.status || "Pending",

    currency:
      tx.currency || "₦",

    date:
      tx.date ||
      new Date().toLocaleString(),

    created_at:
      tx.created_at ||
      new Date().toISOString(),

    proof:
      tx.proof || null,

    narration:
      tx.narration || "",

    // ✅ FIXED
    bankName:
      tx.bankName || "",

    accountNumber:
      tx.accountNumber || "",

    accountName:
      tx.accountName || ""

  };

  console.log("TX PAYLOAD:", payload);

  const { error, data } =
    await supabase
      .from("transactions")
      .insert([payload])
      .select();

  if(error){

    console.log(
      "TRANSACTION ERROR:",
      error
    );

    return false;
  }

  console.log(
    "TRANSACTION SUCCESS:",
    data
  );

  return true;

};

export const updateTransaction = async (id, status) => {

  const { error } = await supabase
    .from("transactions")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.log(error);
    return false;
  }

  return true;
};

// =========================
// ACTIVE INVESTMENTS (SUPABASE)
// =========================

export const getActiveInvestments = async () => {

  const user = await getUser();

  if (!user) return [];

  const { data, error } =
    await supabase
      .from("active_investments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};

export const addActiveInvestment =
async (investment) => {

  const user = await getUser();

  if(!user) return false;

  const { error } =
    await supabase
      .from("active_investments")
      .insert([
        {
          user_id: user.id,

          name: investment.name,
          image: investment.image,
          type: investment.type,

          price: investment.price,

          dailyearning:
            investment.dailyEarning,

          earnings:
            investment.earnings,

          units:
            investment.units,

          unitsleft:
            investment.unitsLeft,

          daysleft:
            investment.daysLeft,

          lastclaim:
            investment.lastClaim
        }
      ]);

  if(error){

    console.log(error);

    return false;

  }

  return true;

};

export const updateActiveInvestment = async (investment) => {

  const { error } =
    await supabase
      .from("active_investments")
      .update({
        earnings: investment.earnings,
        lastclaim: investment.lastClaim,
        unitsleft: investment.unitsLeft,
        daysleft: investment.daysLeft
      })
      .eq("id", investment.id);

  if(error){
    console.log(error);
    return false;
  }

  return true;
};

export const deleteActiveInvestment = async (id) => {

  const { error } = await supabase
    .from("active_investments")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    return false;
  }

  return true;
};

// =========================
// BANK (SUPABASE)
// =========================

export const getBank = async () => {

  const user = await getUser();

  if(!user) return null;

  const { data, error } =
    await supabase
      .from("bank_details")
      .select("*")
      .eq("user_id", user.id)
      .single();

  if(error){

    console.log(error);

    return null;

  }

  return data;

};

export const setBank = async (bankData) => {

  const user = await getUser();

  if(!user) return false;

  // CHECK IF BANK EXISTS
  const { data: existing } =
    await supabase
      .from("bank_details")
      .select("*")
      .eq("user_id", user.id)
      .single();

  // UPDATE EXISTING
  if(existing){

    const { error } =
      await supabase
        .from("bank_details")
        .update({
          bankname:
            bankData.bankname,

          accountnumber:
            bankData.accountnumber,

          accountname:
            bankData.accountname
        })
        .eq("user_id", user.id);

    if(error){

      console.log(error);

      return false;

    }

    return true;
  }

  // CREATE NEW
  const { error } =
    await supabase
      .from("bank_details")
      .insert([
        {
          user_id: user.id,

          bankname:
            bankData.bankname,

          accountnumber:
            bankData.accountnumber,

          accountname:
            bankData.accountname
        }
      ]);

  if(error){

    console.log(error);

    return false;

  }

  return true;

};

// =========================
// TASKS (SUPABASE)
// =========================

export const getTasks = async () => {

  const user = await getUser();

  if(!user) return [];

  const { data, error } =
    await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending:false
      });

  if(error){

    console.log(error);

    return [];

  }

  return data;

};

export const addTask = async (task) => {

  const user = await getUser();

  if(!user) return false;

  const { error } =
    await supabase
      .from("tasks")
      .insert([
        {
          user_id: user.id,

          title:
            task.title,

          reward:
            task.reward,

          completed:
            task.completed || false
        }
      ]);

  if(error){

    console.log(error);

    return false;

  }

  return true;

};

export const updateTask = async (task) => {

  const { error } =
    await supabase
      .from("tasks")
      .update(task)
      .eq("id", task.id);

  return !error;

};

// =========================
// AI MODELS / PRODUCTS
// =========================

// =========================
// PRODUCTS (SUPABASE)
// =========================

export const getProducts = async () => {

  const { data, error } =
    await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending:false
      });

  if(error){

    console.log(error);

    return [];

  }

  return data;

};

export const addProduct = async (product) => {

  console.log("ADDING PRODUCT:", product);

  const { data, error } =
    await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

  if(error){

    console.log("SUPABASE PRODUCT ERROR:", error);

    alert(error.message);

    return null;

  }

  console.log("PRODUCT SAVED:", data);

  return data;

};

export const updateProduct = async (product) => {

  const { error } =
    await supabase
      .from("products")
      .update(product)
      .eq("id", product.id);

  return !error;

};

export const deleteProduct = async (id) => {

  const { error } =
    await supabase
      .from("products")
      .delete()
      .eq("id", id);

  return !error;

};

// CAMPAIGNS STORAGE

// GET CAMPAIGNS
/*export const getCampaigns = async () => {

  const { data, error } =
    await supabase
      .from("campaigns")
      .select("*")
      .order("id", { ascending:false });

  if(error){

    console.log(error);

    return [];

  }

  return data;

};*/

// DELETE CAMPAIGN
export const deleteCampaign = async (id) => {

  const { error } =
    await supabase
      .from("campaigns")
      .delete()
      .eq("id", id);

  if(error){

    console.log(error);

    return false;

  }

  return true;

};

// ===============================
// UNITS STORAGE (SUPABASE)
// ===============================

export const getUnits = async () => {

  const { data, error } =
    await supabase
      .from("units")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if(error){
    console.log(error);
    return [];
  }

  return data;

};

export const saveUnits = async (unit) => {

  const { error } =
    await supabase
      .from("units")
      .insert([unit]);

  if(error){
    console.log(error);
    return false;
  }

  return true;

};

export const deleteUnit = async (id) => {

  const { error } =
    await supabase
      .from("units")
      .delete()
      .eq("id", id);

  return !error;

};

export const updateUnit = async (unit) => {

  const { error } =
    await supabase
      .from("units")
      .update(unit)
      .eq("id", unit.id);

  return !error;

};

// ===============================
// MULTI LEVEL REFERRAL ENGINE
// ===============================

export const processReferralCommission =
async (buyer, productPrice) => {

  const users = await getAllUsers();

  // LEVEL A
  const levelA =
    users.find(
      u => u.id === buyer.referred_by
    );

  if(levelA){

    const commissionA =
      Number(productPrice) * 0.15;

      await addTransaction({

        user_id: levelA.id,

        type: "LEVEL A COMMISSION",

        amount: commissionA,

        currency: "PYE",

        status: "Approved",

        name: buyer.name,

        date: new Date().toLocaleString()

      });

    levelA.pyebalance =
      Number(levelA.pyebalance || 0)
      + commissionA;

    levelA.totalReferralCommission =
      Number(levelA.totalReferralCommission || 0)
      + commissionA;

    levelA.referralCommission =
      Number(levelA.referralCommission || 0)
      + commissionA;

    // ADD/UPDATE REFERRAL
    const existingA =
      (levelA.referrals || [])
        .find(ref => ref.id === buyer.id);

    if(existingA){

      levelA.referrals =
        levelA.referrals.map(ref => {

          if(ref.id === buyer.id){

            return {
              ...ref,
              level:"A",
              hasPurchased:true,
              commission:
                Number(ref.commission || 0)
                + commissionA
            };

          }

          return ref;

        });

    }else{

      levelA.referrals = [

        ...(levelA.referrals || []),

        {
          id: buyer.id,
          level:"A",
          hasPurchased:true,
          commission: commissionA
        }

      ];

    }

    await updateUserEverywhere(levelA);

    // LEVEL B
    const levelB =
      users.find(
        u => u.id === levelA.referred_by
      );

    if(levelB){

      const commissionB =
        Number(productPrice) * 0.045;

        await addTransaction({

          user_id: levelB.id,

          type: "LEVEL B COMMISSION",

          amount: commissionB,

          currency: "PYE",

          status: "Approved",

          name: buyer.name,

          date: new Date().toLocaleString()

        });

      levelB.pyebalance =
        Number(levelB.pyebalance || 0)
        + commissionB;

      levelB.totalReferralCommission =
        Number(levelB.totalReferralCommission || 0)
        + commissionB;

      levelB.referralCommission =
        Number(levelB.referralCommission || 0)
        + commissionB;

      const existingB =
        (levelB.referrals || [])
          .find(ref => ref.id === levelA.id);

      if(existingB){

        levelB.referrals =
          levelB.referrals.map(ref => {

            if(ref.id === levelA.id){

              return {
                ...ref,
                level:"B",
                hasPurchased:true,
                commission:
                  Number(ref.commission || 0)
                  + commissionB
              };

            }

            return ref;

          });

      }else{

        levelB.referrals = [

          ...(levelB.referrals || []),

          {
            id: levelA.id,
            level:"B",
            hasPurchased:true,
            commission: commissionB
          }

        ];

      }

      await updateUserEverywhere(levelB);

      // LEVEL C
      const levelC =
        users.find(
          u => u.id === levelB.referred_by
        );

      if(levelC){

        const commissionC =
          Number(productPrice) * 0.025;
        
        await addTransaction({

          user_id: levelC.id,

          type: "LEVEL C COMMISSION",

          amount: commissionC,

          currency: "PYE",

          status: "Approved",

          name: buyer.name,

          date: new Date().toLocaleString()

        });

        levelC.pyebalance =
          Number(levelC.pyebalance || 0)
          + commissionC;

        levelC.totalReferralCommission =
          Number(levelC.totalReferralCommission || 0)
          + commissionC;

        levelC.referralCommission =
          Number(levelC.referralCommission || 0)
          + commissionC;

        const existingC =
          (levelC.referrals || [])
            .find(ref => ref.id === levelB.id);

        if(existingC){

          levelC.referrals =
            levelC.referrals.map(ref => {

              if(ref.id === levelB.id){

                return {
                  ...ref,
                  level:"C",
                  hasPurchased:true,
                  commission:
                    Number(ref.commission || 0)
                    + commissionC
                };

              }

              return ref;

            });

        }else{

          levelC.referrals = [

            ...(levelC.referrals || []),

            {
              id: levelB.id,
              level:"C",
              hasPurchased:true,
              commission: commissionC
            }

          ];

        }

        await updateUserEverywhere(levelC);

      }

    }

  }

};

// ===============================
// CAMPAIGN ENGINE
// ===============================

// START CAMPAIGN
export const startCampaign =
async (campaignId) => {

  const user = await getUser();

  if(!user) return false;

  const campaigns =
    await getCampaigns();

  const campaign =
    campaigns.find(
      c => c.id === campaignId
    );

  if(!campaign) return false;

  const startTime =
    new Date();

  const endTime =
    new Date(
      startTime.getTime()
      + (
        Number(campaign.duration || 24)
        * 60 * 60 * 1000
      )
    );

  const { error } =
    await supabase
      .from("campaigns")
      .update({

        status:"progress",

        progress:0,

        failed:false,

        claimed:false,

        user_id:user.id,

        starttime:
          startTime.toISOString(),

        endtime:
          endTime.toISOString()

      })
      .eq("id", Number(campaignId));

  if(error){

    console.log(error);

    return false;

  }

  return true;

};

// UPDATE CAMPAIGN PROGRESS
export const updateCampaignProgress =
async (campaignId, amount = 1) => {

  const campaigns =
    await getCampaigns();

  const campaign =
    campaigns.find(
      c => c.id === campaignId
    );

  if(!campaign) return false;

  const newProgress =
    Number(campaign.progress || 0)
    + Number(amount);

  const completed =
    newProgress >=
    Number(campaign.target || 0);

  const { error } =
    await supabase
      .from("campaigns")
      .update({

        progress:newProgress,

        completed

      })
      .eq("id", Number(campaignId));

  if(error){

    console.log(error);

    return false;

  }

  return true;

};

// FAIL CAMPAIGN
export const failCampaign =
async (campaignId) => {

  const { error } =
    await supabase
      .from("campaigns")
      .update({

        failed:true,

        status:"failed"

      })
      .eq("id", Number(campaignId));

  if(error){

    console.log(error);

    return false;

  }

  return true;

};

// CLAIM CAMPAIGN REWARD
export const claimCampaignReward =
async (campaignId) => {

  const user =
    await getUser();

  const campaigns =
    await getCampaigns();

  const campaign =
    campaigns.find(
      c => c.id === campaignId
    );

  if(!campaign) return false;

  if(campaign.claimed){

    return false;

  }

  const reward =
    Number(campaign.reward || 0);

  user.pyebalance =
    Number(user.pyebalance || 0)
    + reward;

  await updateUserEverywhere(user);

  await addTransaction({

    type:"CAMPAIGN REWARD",

    amount:reward,

    name:campaign.title,

    date:new Date()
      .toLocaleString()

  });

  const { error } =
    await supabase
      .from("campaigns")
      .update({

        claimed:true,

        rewardgiven:true,

        status:"done"

      })
      .eq("id", Number(campaignId));

  if(error){

    console.log(error);

    return false;

  }

  return true;

};

// =========================
// ADMIN SETTINGS
// =========================

// GET SETTINGS
export const getAdminSettings = async () => {

  const { data, error } =
    await supabase
      .from("admin_settings")
      .select("*")
      .limit(1)
      .single();

  if(error){

    console.log("GET SETTINGS ERROR:", error);

    return null;

  }

  console.log("SETTINGS:", data);

  return data;

};

// UPDATE SETTINGS
export const updateAdminSettings =
async (settings) => {

  if(!settings?.id){

    console.log("NO SETTINGS ID");

    return false;

  }

  const cleanSettings = {

    pyeRate:
      Number(settings.pyeRate || 0),

    platformFee:
      Number(settings.platformFee || 0),

    withdrawalFee:
      Number(settings.withdrawalFee || 0),

    maintenance:
      settings.maintenance || false,

    registration:
      settings.registration || false,

    emailVerification:
      settings.emailVerification || false,

    kyc:
      settings.kyc || false,

    autoApprove:
      settings.autoApprove || false,

    adminNotifications:
      settings.adminNotifications || false,

    reportNotifications:
      settings.reportNotifications || false,

    transactionAlerts:
      settings.transactionAlerts || false,

    userLogs:
      settings.userLogs || false,

    adminLogs:
      settings.adminLogs || false,

    financeLogs:
      settings.financeLogs || false

  };

  const { data, error } =
    await supabase
      .from("admin_settings")
      .update(cleanSettings)
      .eq("id", settings.id)
      .select();

  if(error){

    console.log(
      "ADMIN SETTINGS ERROR:",
      error
    );

    alert(error.message);

    return false;

  }

  console.log(
    "SETTINGS UPDATED:",
    data
  );

  return true;

};

/*
// =========================
// NOTIFICATIONS STORAGE
// =========================

// UPLOAD IMAGE TO SUPABASE STORAGE
export const uploadNotificationImage = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase
    .storage
    .from("notification-images")
    .upload(fileName, file);

  if (error) {
    console.log("UPLOAD ERROR:", error);
    return null;
  }

  const { data: urlData } = supabase
    .storage
    .from("notification-images")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};

// CREATE NOTIFICATION
export const addNotification = async (notification) => {
  const { error } = await supabase
    .from("admin_notifications")
    .insert([notification]);

  if (error) {
    console.log(error);
    return false;
  }

  return true;
};

// GET LATEST NOTIFICATION
export const getLatestNotification = async () => {
  const { data, error } = await supabase
    .from("admin_notifications")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;

  return data;
};
*/